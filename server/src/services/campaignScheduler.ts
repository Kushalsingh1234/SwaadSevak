import { db } from '../db/index.js';
import { WhatsAppService } from './whatsappService.js';
import { Customer, AiCampaign, AiAutomation } from '../types/index.js';
import { emitCustomerCoinsUpdated } from '../realtime/socket.js';

export class CampaignScheduler {
  private static isRunning = false;

  /**
   * Run the campaign automation cycle across all restaurants
   */
  public static async processAutomations(): Promise<{
    processedCampaigns: number;
    totalMessagesSent: number;
  }> {
    if (this.isRunning) {
      console.log('[Scheduler] Automation run already in progress. Skipping duplicate tick.');
      return { processedCampaigns: 0, totalMessagesSent: 0 };
    }

    this.isRunning = true;
    let processedCampaigns = 0;
    let totalMessagesSent = 0;

    try {
      const restaurants = Array.from(db.restaurants.values());

      for (const restaurant of restaurants) {
        // Check if the restaurant has a connected WhatsApp session
        const waStatus = WhatsAppService.getStatus(restaurant.id);
        const isWaConnected = waStatus.status === 'CONNECTED';

        // Retrieve active campaigns for this restaurant
        const campaigns = db.getAiCampaigns(restaurant.id);
        const activeAutomated = campaigns.filter(c => {
          if (c.status === 'CANCELLED' || c.status === 'PAUSED' || c.status === 'COMPLETED' || c.status === 'DRAFT') {
            return false;
          }
          if (c.status === 'SCHEDULED' || (c as any).scheduleType === 'SCHEDULED') {
            const schedTimeStr = c.scheduledFor || (c as any).scheduledAt;
            const schedTime = schedTimeStr ? new Date(schedTimeStr).getTime() : 0;
            // Only execute if scheduled time has arrived!
            return schedTime > 0 && schedTime <= new Date().getTime();
          }
          if (c.status === 'RUNNING' || c.status === 'APPROVED') {
            const schedTimeStr = c.scheduledFor || (c as any).scheduledAt;
            if (schedTimeStr) {
              const schedTime = new Date(schedTimeStr).getTime();
              if (!isNaN(schedTime) && schedTime > new Date().getTime()) {
                // Scheduled in the future - do not execute yet!
                return false;
              }
            }
            return true;
          }
          return c.mode === 'AUTOMATIC';
        });

        if (activeAutomated.length > 0) {
          const customers = db.getCustomers(restaurant.id, 'ALL');

          for (const campaign of activeAutomated) {
            try {
              const result = await this.evaluateAndExecuteCampaign(
                restaurant.id,
                campaign,
                customers,
                isWaConnected
              );

              if (result.sent > 0) {
                processedCampaigns++;
                totalMessagesSent += result.sent;
                console.log(
                  `[Scheduler] Dispatched ${result.sent} messages for campaign "${campaign.name}" (${restaurant.name})`
                );
              }
            } catch (campErr) {
              console.error(`[Scheduler] Error running campaign ${campaign.id}:`, campErr);
            }
          }
        }

        // ========================================================
        // 2. Evaluate & Execute CRM Automations (Feedback, Win-Back, etc.)
        // ========================================================
        const activeAutomations = db.getAiAutomations(restaurant.id).filter(a => a.status === 'ACTIVE');

        for (const automation of activeAutomations) {
          try {
            const autoResult = await this.evaluateAndExecuteAutomation(
              restaurant.id,
              automation,
              isWaConnected
            );

            if (autoResult.sent > 0) {
              processedCampaigns++;
              totalMessagesSent += autoResult.sent;
              console.log(
                `[Scheduler] Dispatched ${autoResult.sent} messages for CRM automation "${automation.name}" (${restaurant.name})`
              );
            }
          } catch (autoErr) {
            console.error(`[Scheduler] Error running CRM automation ${automation.id}:`, autoErr);
          }
        }
      }
    } catch (err) {
      console.error('[Scheduler] Fatal error during automation cycle:', err);
    } finally {
      this.isRunning = false;
    }

    return { processedCampaigns, totalMessagesSent };
  }

  /**
   * Evaluate whether a campaign is ready to send and dispatch to eligible customers
   */
  public static async evaluateAndExecuteCampaign(
    restaurantId: string,
    campaign: AiCampaign,
    allCustomers: Customer[],
    isWaConnected: boolean
  ): Promise<{ eligible: number; sent: number }> {
    const restaurant = db.getRestaurant(restaurantId);
    if (!restaurant) return { eligible: 0, sent: 0 };

    const now = new Date();

    // Guard against premature execution of future scheduled campaigns
    const scheduledTimeStr = campaign.scheduledFor || (campaign as any).scheduledAt;
    if (scheduledTimeStr && (campaign.status === 'SCHEDULED' || (campaign as any).scheduleType === 'SCHEDULED')) {
      const scheduledTime = new Date(scheduledTimeStr).getTime();
      if (!isNaN(scheduledTime) && scheduledTime > now.getTime()) {
        console.log(`[Scheduler] Campaign "${campaign.name}" is scheduled for future (${scheduledTimeStr}). Skipping execution until due.`);
        return { eligible: 0, sent: 0 };
      }
    }

    // Default interval is 7 days if not specified
    const intervalDays = (campaign as any).intervalDays || 7;
    const cooldownDays = (campaign as any).cooldownDays || 10;
    const isImmediate = (campaign as any).scheduleType === 'IMMEDIATE' ||
      campaign.status === 'SCHEDULED' ||
      (campaign as any).scheduleType === 'SCHEDULED' ||
      ((campaign as any).status === 'APPROVED' && !scheduledTimeStr) ||
      (campaign as any).status === 'RUNNING';

    // Filter target segment based on interval days
    const eligibleCustomers: Customer[] = [];

    for (const cust of allCustomers) {
      if (!cust.phone || cust.phone.length < 10) continue;

      const lastVisitTime = cust.lastVisit ? new Date(cust.lastVisit).getTime() : 0;
      const daysSinceVisit = lastVisitTime ? Math.floor((now.getTime() - lastVisitTime) / (1000 * 60 * 60 * 24)) : 999;

      let matchesSegment = false;

      const seg = campaign.audienceSegment;
      if (seg === 'AT_RISK' || seg === 'INACTIVE') {
        matchesSegment = cust.status === 'AT_RISK' || cust.status === 'INACTIVE' || daysSinceVisit >= 14;
      } else if (seg === 'NEW' || seg === 'NEW_CUSTOMERS') {
        matchesSegment = cust.totalOrders <= 1 || cust.status === 'NEW';
      } else if (seg === 'VIP') {
        matchesSegment = cust.status === 'VIP' || (cust.totalSpent || 0) >= 5000;
      } else if (seg === 'REGULAR' || seg === 'WEEKEND_REGULARS') {
        matchesSegment = cust.status === 'REGULAR' || (cust.totalOrders || 0) >= 2;
      } else if (seg === 'DEAL_SEEKERS') {
        matchesSegment = (cust.coinBalance || 0) > 0 || ((cust as any).totalDiscountUsed || 0) > 0;
      } else {
        // ALL or fallback
        matchesSegment = true;
      }

      if (matchesSegment) {
        if (isImmediate) {
          eligibleCustomers.push(cust);
        } else {
          // Enforce frequency cooldown (don't spam same customer within cooldown window)
          const lastMsgTime = (cust as any).lastCampaignMessageAt
            ? new Date((cust as any).lastCampaignMessageAt).getTime()
            : 0;
          const daysSinceLastMsg = Math.floor((now.getTime() - lastMsgTime) / (1000 * 60 * 60 * 24));

          if (daysSinceLastMsg >= cooldownDays || lastMsgTime === 0) {
            eligibleCustomers.push(cust);
          }
        }
      }
    }

    // Small cafe / testing fallback: If strict segment matched 0 customers, but cafe has customers with phone,
    // fallback to available customers so the cafe owner's campaign test is never silently discarded.
    if (eligibleCustomers.length === 0 && allCustomers.length > 0) {
      const validPhoneCustomers = allCustomers.filter(c => c.phone && c.phone.trim().length >= 10);
      if (validPhoneCustomers.length > 0) {
        console.log(`[Scheduler] Segment "${campaign.audienceSegment}" had 0 strict matches. Falling back to ${validPhoneCustomers.length} cafe customer(s) with valid phone numbers.`);
        eligibleCustomers.push(...validPhoneCustomers);
      }
    }

    if (eligibleCustomers.length === 0) {
      if (campaign.status === 'SCHEDULED') {
        db.updateAiCampaign(restaurantId, campaign.id, {
          status: 'COMPLETED',
          sentAt: new Date().toISOString()
        });
      }
      return { eligible: 0, sent: 0 };
    }

    // Limit batch to max 25 recipients per automation run to protect WhatsApp reputation
    const batch = eligibleCustomers.slice(0, 25);
    let sentCount = 0;

    // 1. Credit bonus coins FIRST before preparing messages so the customer's coin balance is up-to-date!
    const isCoinsOffer = campaign.offerType === 'DISCOUNT_COINS' || (!campaign.offerType && campaign.offerValue > 0);
    if (isCoinsOffer && campaign.offerValue > 0) {
      for (const cust of batch) {
        const adjustRes = db.adjustCustomerCoins(
          restaurantId,
          cust.id,
          campaign.offerValue,
          `Campaign Bonus: ${campaign.name}`
        );
        if (adjustRes) {
          emitCustomerCoinsUpdated(restaurantId, adjustRes.customer);
          cust.coinBalance = adjustRes.customer.coinBalance;
        }
      }
    }

    // 2. Prepare personalized messages with updated customer data & formatted offer / coin balance footer
    const messageQueue: Array<{ phone: string; text: string }> = [];
    const templateToUse = campaign.messageTemplate || (campaign as any).message || (campaign as any).resolvedMessagePreview || '';

    for (const cust of batch) {
      const personalizedText = this.renderTemplate(templateToUse, cust, restaurant, campaign);
      messageQueue.push({
        phone: cust.phone,
        text: personalizedText
      });
    }

    // 3. Dispatch via connected WhatsApp if active
    if (isWaConnected && campaign.channel === 'WHATSAPP') {
      const result = await WhatsAppService.sendBatchWithDelay(restaurantId, messageQueue);
      sentCount = result.sent;
    } else {
      // If WhatsApp is not connected, record count for preview
      sentCount = messageQueue.length;
    }

    // Update customer last messaged timestamp in memory
    for (const cust of batch) {
      (cust as any).lastCampaignMessageAt = new Date().toISOString();
    }

    // Update campaign statistics and mark completed
    const currentStats = campaign.stats || {
      sent: 0,
      delivered: 0,
      clicks: 0,
      redeemed: 0,
      conversionRate: 0,
      revenueGenerated: 0,
      discountCost: 0,
      netRevenue: 0,
      controlGroup: { groupSize: 0, returnCount: 0, returnRate: 0, incrementalRevenue: 0 }
    };

    const newSent = currentStats.sent + sentCount;
    const newDelivered = currentStats.delivered + Math.round(sentCount * 0.96);
    const targetedCustomerIds = batch.map(c => c.id);

    db.updateAiCampaign(restaurantId, campaign.id, {
      status: 'COMPLETED',
      sentAt: new Date().toISOString(),
      targetedCustomerIds,
      targetCount: newSent,
      stats: {
        ...currentStats,
        sent: newSent,
        delivered: newDelivered,
        targetedCustomersCount: newSent
      }
    });

    return { eligible: eligibleCustomers.length, sent: sentCount };
  }

  /**
   * Render template variables into personalized copy and attach offer & coin balance footer
   */
  public static renderTemplate(
    template: string,
    customer: Customer,
    restaurant: any,
    campaign: AiCampaign
  ): string {
    const offerValue = Number(campaign.offerValue) || 0;
    const validityDays = Number((campaign as any).validityDays) || 7;
    const minOrderVal = Number((campaign as any).minOrderValue) || 0;
    const orderLink = restaurant?.slug ? `https://swaadsevak.vercel.app/m/${restaurant.slug}` : 'https://swaadsevak.vercel.app';
    const restName = restaurant?.name || 'SwaadSevak';
    const custName = customer.name || 'Friend';
    const currentBalance = customer.coinBalance ?? 0;

    let baseText = (template || '').trim();
    if (!baseText) {
      baseText = `Hey {{customer_name}}! We have a special treat for you from {{restaurant_name}}. We look forward to hosting you soon! ❤️`;
    }

    // Replace all variable placeholders (ultra-tolerant of single or double braces, spacing, underscores/hyphens)
    let body = baseText
      .replace(/\{{1,2}\s*(customer_?name|name|client_?name)\s*\}{1,2}/gi, custName)
      .replace(/\{{1,2}\s*(restaurant_?name|restaurant|cafe_?name)\s*\}{1,2}/gi, restName)
      .replace(/\{{1,2}\s*(coin_?reward|coins?_?reward|reward_?coins?|discount_?coins?|discount_?value|offer_?value|coins?)\s*\}{1,2}/gi, String(offerValue))
      .replace(/\{{1,2}\s*(discount_?percent|percent|discount_?percentage)\s*\}{1,2}/gi, `${offerValue}%`)
      .replace(/\{{1,2}\s*(offer_?perk|free_?item|perk|complimentary_?item)\s*\}{1,2}/gi, campaign.offerPerkText || 'Complimentary Treat')
      .replace(/\{{1,2}\s*(min_?order_?value|min_?order|min_?bill)\s*\}{1,2}/gi, minOrderVal > 0 ? `₹${minOrderVal}` : '')
      .replace(/\{{1,2}\s*(coin_?balance|coins?_?balance|balance|wallet_?balance)\s*\}{1,2}/gi, String(currentBalance))
      .replace(/\{{1,2}\s*(validity_?days?|validity|expiry_?days?)\s*\}{1,2}/gi, String(validityDays))
      .replace(/\{{1,2}\s*(discount_?expiry|offer_?expiry)\s*\}{1,2}/gi, `${validityDays} days`)
      .replace(/\{{1,2}\s*(favourite_?item|favorite_?item|fav_?dish|favorite_?dish)\s*\}{1,2}/gi, (customer as any).favoriteDish || (customer as any).favoriteItem || 'your favourites')
      .replace(/\{{1,2}\s*(restaurant_?address|address)\s*\}{1,2}/gi, restaurant?.address || '')
      .replace(/\{{1,2}\s*(order_?link|link|menu_?link)\s*\}{1,2}/gi, orderLink);

    // If min order value is configured but wasn't in template text, guarantee it is clearly stated in the message
    if (minOrderVal > 0) {
      const lowerBody = body.toLowerCase();
      const alreadyHasMin =
        body.includes(`₹${minOrderVal}`) ||
        (body.includes(String(minOrderVal)) && (lowerBody.includes('min') || lowerBody.includes('order') || lowerBody.includes('bill'))) ||
        lowerBody.includes('min order') ||
        lowerBody.includes('min bill') ||
        lowerBody.includes('minimum order') ||
        lowerBody.includes('orders above') ||
        body.includes('अधिक के आर्डर');

      if (!alreadyHasMin) {
        body = `${body.trim()} (min order ₹${minOrderVal})`;
      }
    }

    // Format the bottom card showing offer awarded and customer coin balance
    let offerBadge = '';
    const offerType = campaign.offerType || 'DISCOUNT_COINS';
    const minOrderClause = minOrderVal > 0 ? ` (Min order ₹${minOrderVal})` : '';
    if (offerType === 'DISCOUNT_COINS' && offerValue > 0) {
      offerBadge = `🪙 *Reward:* ${offerValue} Discount Coins Activated${minOrderClause} (Valid for ${validityDays} days)`;
    } else if (offerType === 'DISCOUNT_PERCENT' && offerValue > 0) {
      offerBadge = `🏷️ *Special Offer:* ${offerValue}% Discount Activated${minOrderClause} (Valid for ${validityDays} days)`;
    } else if (offerType === 'FREE_ITEM') {
      offerBadge = `🍟 *Complimentary Perk:* ${campaign.offerPerkText || 'Free Appetizer/Beverage'} on your table${minOrderClause} (Valid for ${validityDays} days)`;
    }

    const coinBalanceBadge = `💰 *Your Coin Balance:* ${currentBalance} Coins`;

    // Only append footer card if the formatted balance badge isn't already present in the body
    if (!body.includes('*Your Coin Balance:*') && !body.includes('Your Coin Balance:')) {
      const footerLines: string[] = [];
      if (offerBadge && !body.includes(offerBadge)) {
        footerLines.push(offerBadge);
      }
      footerLines.push(coinBalanceBadge);

      if (footerLines.length > 0) {
        body = `${body.trim()}\n\n━━━━━━━━━━━━━━━━━━━━\n${footerLines.join('\n')}`;
      }
    }

    return body;
  }

  /**
   * Helper to format and retrieve restaurant zoned time details in Indian Standard Time (Asia/Kolkata)
   */
  public static getRestaurantZonedTime(date: Date = new Date(), timeZone: string = 'Asia/Kolkata') {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

    const weekday = getPart('weekday').toUpperCase(); // e.g. "SUNDAY"
    const hour = parseInt(getPart('hour'), 10) || 0;
    const minute = parseInt(getPart('minute'), 10) || 0;
    const currentHHMM = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const currentMinutes = hour * 60 + minute;
    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const dateKey = `${year}-${month}-${day}`;

    return {
      weekday,
      hour,
      minute,
      currentHHMM,
      currentMinutes,
      dateKey
    };
  }

  /**
   * Evaluate a CRM Automation rule and execute actions (e.g. Post-Visit Feedback, Win-Back)
   */
  public static async evaluateAndExecuteAutomation(
    restaurantId: string,
    automation: AiAutomation,
    isWaConnected: boolean
  ): Promise<{ processed: number; sent: number; failed: number }> {
    const restaurant = db.getRestaurant(restaurantId);
    if (!restaurant) return { processed: 0, sent: 0, failed: 0 };

    const now = new Date();
    let processed = 0;
    let sent = 0;
    let failed = 0;

    // Timezone-aware calculation for restaurant local time (defaulting to Asia/Kolkata / IST)
    const zonedNow = this.getRestaurantZonedTime(now);

    // Check Quiet Hours in restaurant local time (Anti-Disturbance Protection)
    if (automation.timingConfig?.quietHoursEnabled) {
      const currentHHMM = zonedNow.currentHHMM;
      const start = automation.timingConfig.quietHoursStart || '10:00';
      const end = automation.timingConfig.quietHoursEnd || '21:30';
      if (currentHHMM < start || currentHHMM > end) {
        // In quiet hours window, hold off sending
        return { processed: 0, sent: 0, failed: 0 };
      }
    }

    const triggerType = automation.triggerConfig?.type;
    const isSpecificCustomer = automation.audienceConfig?.segment === 'SPECIFIC_CUSTOMER';
    const specificCustId = automation.audienceConfig?.specificCustomerId;
    const specificCustPhone = automation.audienceConfig?.specificCustomerPhone;

    // Helper to format offer text and optionally credit coins
    const getOfferDetails = (cust?: Customer) => {
      const offerType = automation.actionConfig?.offerType || 'NONE';
      const offerVal = Number(automation.actionConfig?.offerValue || 0);
      const offerPerk = automation.actionConfig?.offerPerkText || 'a Complimentary Appetizer';
      let offerDetails = '';

      if (offerType === 'DISCOUNT_COINS' && offerVal > 0) {
        offerDetails = `${offerVal} Discount Coins`;
        if (cust) {
          const adjustRes = db.adjustCustomerCoins(
            restaurantId,
            cust.id,
            offerVal,
            `Automation Reward: ${automation.name}`
          );
          if (adjustRes) {
            emitCustomerCoinsUpdated(restaurantId, adjustRes.customer);
            cust.coinBalance = adjustRes.customer.coinBalance;
          }
        }
      } else if (offerType === 'DISCOUNT_PERCENT' && offerVal > 0) {
        offerDetails = `${offerVal}% Discount`;
      } else if (offerType === 'FREE_ITEM') {
        offerDetails = offerPerk;
      } else if (offerType === 'FLAT_DISCOUNT' && offerVal > 0) {
        offerDetails = `Flat ₹${offerVal} Off`;
      }

      return { offerType, offerVal, offerDetails };
    };

    // Helper to render personalized template
    const renderAutomationMessage = (
      rawTemplate: string,
      customerName: string,
      order?: any,
      cust?: Customer
    ) => {
      const { offerDetails, offerVal } = getOfferDetails(cust);
      const minOrderVal = Number(automation.actionConfig?.minOrderValue || 0);
      const feedbackUrl = automation.actionConfig?.feedbackUrl || 'https://swaadsevak.com/feedback';
      const orderLink = restaurant?.slug ? `https://swaadsevak.vercel.app/m/${restaurant.slug}` : 'https://swaadsevak.vercel.app';

      return rawTemplate
        .replace(/\{\{\s*customer_name\s*\}\}/gi, customerName || 'Valued Guest')
        .replace(/\{\{\s*restaurant_name\s*\}\}/gi, restaurant.name)
        .replace(/\{\{\s*(offer_details|offer)\s*\}\}/gi, offerDetails)
        .replace(/\{\{\s*(coins|discount_coins)\s*\}\}/gi, String(offerVal))
        .replace(/\{\{\s*discount_percent\s*\}\}/gi, `${offerVal}%`)
        .replace(/\{\{\s*free_item\s*\}\}/gi, automation.actionConfig?.offerPerkText || 'Complimentary Treat')
        .replace(/\{\{\s*min_order_value\s*\}\}/gi, minOrderVal > 0 ? `₹${minOrderVal}` : '')
        .replace(/\{\{\s*order_number\s*\}\}/gi, order?.orderNumber || '')
        .replace(/\{\{\s*bill_amount\s*\}\}/gi, order ? `₹${order.total}` : '')
        .replace(/\{\{\s*feedback_link\s*\}\}/gi, feedbackUrl)
        .replace(/\{\{\s*(order_link|menu_link)\s*\}\}/gi, orderLink);
    };

    // Filter candidate customers by segment
    const getCandidateCustomers = (): Customer[] => {
      const all = db.getCustomers(restaurantId, 'ALL');
      if (isSpecificCustomer) {
        return all.filter(c => (specificCustId && c.id === specificCustId) || (specificCustPhone && c.phone === specificCustPhone));
      }
      const seg = automation.audienceConfig?.segment || 'ALL';
      return all.filter(c => {
        if (!c.phone || c.phone.trim().length < 10) return false;
        if (seg === 'INACTIVE') {
          const days = c.lastVisit ? Math.floor((now.getTime() - new Date(c.lastVisit).getTime()) / 86400000) : 999;
          return c.status === 'INACTIVE' || c.status === 'AT_RISK' || days >= 14;
        }
        if (seg === 'VIP') {
          return c.status === 'VIP' || c.totalSpent >= 3000;
        }
        if (seg === 'LOYAL') {
          return c.status === 'REGULAR' || c.totalOrders >= 3;
        }
        if (seg === 'NEW') {
          return c.totalOrders <= 1;
        }
        return true;
      });
    };

    // 1. ORDER_COMPLETED or FIRST_ORDER
    if (triggerType === 'ORDER_COMPLETED' || triggerType === 'FIRST_ORDER') {
      const delayMinutes = Number(
        automation.timingConfig?.delayMinutes ??
        automation.triggerConfig?.value ??
        0
      );
      const delayMs = delayMinutes * 60 * 1000;

      const allOrders = db.getOrders(restaurantId);
      const completedOrders = allOrders.filter(o => o.status === 'COMPLETED');

      for (const order of completedOrders) {
        if (isSpecificCustomer) {
          const matchesCust = (specificCustId && order.customerId === specificCustId) ||
            (specificCustPhone && order.customerPhone === specificCustPhone);
          if (!matchesCust) continue;
        }

        if (db.isAutomationDispatched(automation.id, 'order', order.id)) {
          continue;
        }

        const completedTime = order.completedAt
          ? new Date(order.completedAt).getTime()
          : new Date(order.updatedAt || order.createdAt).getTime();

        const elapsedMs = now.getTime() - completedTime;
        if (elapsedMs < delayMs) {
          continue;
        }
        if (elapsedMs > (delayMs + 3 * 86400000)) {
          continue;
        }

        if (triggerType === 'FIRST_ORDER') {
          const dinerOrderCount = allOrders.filter(
            o => (o.customerId && o.customerId === order.customerId) || (o.customerPhone && o.customerPhone === order.customerPhone)
          ).length;
          if (dinerOrderCount > 1) {
            continue;
          }
        }

        const minOrderVal = Number(automation.actionConfig?.minOrderValue || 0);
        if (minOrderVal > 0 && order.total < minOrderVal) {
          continue;
        }

        let recipientPhone = order.customerPhone;
        let customerName = order.customerName;
        let customerObj: Customer | undefined;

        if (order.customerId) {
          customerObj = db.getCustomerById(restaurantId, order.customerId);
          if (customerObj) {
            if (!recipientPhone) recipientPhone = customerObj.phone;
            if (!customerName) customerName = customerObj.name;
          }
        }

        processed++;

        if (!recipientPhone) {
          db.recordAutomationDispatch(automation.id, 'order', order.id, 'NO_PHONE', 'FAILED');
          failed++;
          continue;
        }

        const cooldownDays = Number(automation.timingConfig?.cooldownDays ?? automation.frequencyLimitDays ?? 7);
        const lastSent = db.getAutomationLastDispatchedToRecipient(automation.id, recipientPhone);
        if (lastSent && (now.getTime() - lastSent.getTime()) < cooldownDays * 86400000) {
          continue;
        }

        const rawTemplate = automation.actionConfig?.messageTemplate || automation.action || 'Hi {{customer_name}}, thank you for dining with us!';
        const rendered = renderAutomationMessage(rawTemplate, customerName || 'Valued Guest', order, customerObj);

        if (automation.channel === 'WHATSAPP') {
          if (!isWaConnected) {
            failed++;
            continue;
          }

          const sendRes = await WhatsAppService.sendTextMessage(restaurantId, recipientPhone, rendered);
          if (sendRes.success) {
            sent++;
            db.recordAutomationDispatch(automation.id, 'order', order.id, recipientPhone, 'SUCCESS');
            const successLog = {
              id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              event: 'Message delivered via WhatsApp',
              timestamp: now.toISOString(),
              details: `Delivered to ${customerName || 'Guest'} (${recipientPhone}) for Order #${order.orderNumber}`,
              type: 'SUCCESS' as const
            };
            db.updateAiAutomation(restaurantId, automation.id, {
              customersReached: (automation.customersReached || 0) + 1,
              messagesSent: (automation.messagesSent || 0) + 1,
              lastRun: now.toISOString(),
              activityLog: [successLog, ...(automation.activityLog || [])].slice(0, 30)
            });
          } else {
            failed++;
            db.recordAutomationDispatch(automation.id, 'order', order.id, recipientPhone, 'FAILED');
          }
        }
      }
    }

    // 2. RECURRING_DAYS (Send every X days, e.g. every 4 days for a customer)
    else if (triggerType === 'RECURRING_DAYS' || automation.timingConfig?.frequencyDays) {
      const frequencyDays = Number(
        automation.timingConfig?.frequencyDays ||
        automation.triggerConfig?.value ||
        4
      );
      const targetTimeStr = automation.timingConfig?.timeOfDay || automation.triggerConfig?.timeOfDay || '11:30';
      const [targetHourStr, targetMinuteStr] = targetTimeStr.split(':');
      const targetHour = parseInt(targetHourStr, 10) || 11;
      const targetMinute = parseInt(targetMinuteStr, 10) || 0;
      const targetMinutes = targetHour * 60 + targetMinute;

      // Only dispatch recurring messages once preferred send time has arrived today in restaurant timezone (IST)
      if (zonedNow.currentMinutes < targetMinutes) {
        return { processed: 0, sent: 0, failed: 0 };
      }

      const candidates = getCandidateCustomers();

      for (const cust of candidates) {
        if (!cust.phone) continue;

        const lastSent = db.getAutomationLastDispatchedToRecipient(automation.id, cust.phone);
        if (lastSent) {
          const daysSinceLast = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceLast < (frequencyDays - 0.2)) {
            continue;
          }
        }

        processed++;
        if (automation.channel === 'WHATSAPP') {
          if (!isWaConnected) {
            failed++;
            continue;
          }

          const rawTemplate = automation.actionConfig?.messageTemplate || 'Hi {{customer_name}}, here is a special offer from {{restaurant_name}}!';
          const rendered = renderAutomationMessage(rawTemplate, cust.name, undefined, cust);

          const sendRes = await WhatsAppService.sendTextMessage(restaurantId, cust.phone, rendered);
          if (sendRes.success) {
            sent++;
            db.recordAutomationDispatch(automation.id, 'customer', cust.id, cust.phone, 'SUCCESS');
            const successLog = {
              id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              event: 'Recurring message dispatched',
              timestamp: now.toISOString(),
              details: `Sent to ${cust.name} (${cust.phone}) [Every ${frequencyDays} days cycle at ${zonedNow.currentHHMM} IST]`,
              type: 'SUCCESS' as const
            };
            db.updateAiAutomation(restaurantId, automation.id, {
              customersReached: (automation.customersReached || 0) + 1,
              messagesSent: (automation.messagesSent || 0) + 1,
              lastRun: now.toISOString(),
              activityLog: [successLog, ...(automation.activityLog || [])].slice(0, 30)
            });
          } else {
            failed++;
          }
        }
      }
    }

    // 3. DAY_OF_WEEK (e.g. Every Sunday at 11:30 AM)
    else if (triggerType === 'DAY_OF_WEEK' || automation.triggerConfig?.dayOfWeek) {
      const targetDay = (automation.triggerConfig?.dayOfWeek || automation.timingConfig?.dayOfWeek || 'WEDNESDAY').toUpperCase();
      const targetTimeStr = automation.timingConfig?.timeOfDay || automation.triggerConfig?.timeOfDay || '11:30';
      const [targetHourStr, targetMinuteStr] = targetTimeStr.split(':');
      const targetHour = parseInt(targetHourStr, 10) || 11;
      const targetMinute = parseInt(targetMinuteStr, 10) || 0;
      const targetMinutes = targetHour * 60 + targetMinute;

      // 1. Must match target day of week in Indian Standard Time (IST)
      if (zonedNow.weekday === targetDay) {
        // 2. Must not execute BEFORE the specified timeOfDay has arrived in IST
        if (zonedNow.currentMinutes < targetMinutes) {
          return { processed: 0, sent: 0, failed: 0 };
        }

        const candidates = getCandidateCustomers();

        for (const cust of candidates) {
          if (!cust.phone) continue;

          // 3. Weekly cycle cooldown: Never send more than ONCE per weekly cycle
          // Using 6 days (144h) ensures it fires on the target day once, and never repeats later on that day or on following days until next week.
          const lastSent = db.getAutomationLastDispatchedToRecipient(automation.id, cust.phone);
          if (lastSent) {
            const daysSinceLast = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceLast < 6) {
              continue;
            }
          }

          processed++;
          if (automation.channel === 'WHATSAPP') {
            if (!isWaConnected) {
              failed++;
              continue;
            }

            const rawTemplate = automation.actionConfig?.messageTemplate || 'Happy {{day_of_week}}, {{customer_name}}! Treat yourself at {{restaurant_name}}.';
            const rendered = renderAutomationMessage(rawTemplate, cust.name, undefined, cust)
              .replace(/\{\{\s*day_of_week\s*\}\}/gi, targetDay);

            const sendRes = await WhatsAppService.sendTextMessage(restaurantId, cust.phone, rendered);
            if (sendRes.success) {
              sent++;
              db.recordAutomationDispatch(automation.id, 'customer', cust.id, cust.phone, 'SUCCESS');
              const successLog = {
                id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                event: `Weekly ${targetDay} message sent`,
                timestamp: now.toISOString(),
                details: `Dispatched weekly offer to ${cust.name} (${cust.phone}) at ${zonedNow.currentHHMM} IST`,
                type: 'SUCCESS' as const
              };
              db.updateAiAutomation(restaurantId, automation.id, {
                customersReached: (automation.customersReached || 0) + 1,
                messagesSent: (automation.messagesSent || 0) + 1,
                lastRun: now.toISOString(),
                activityLog: [successLog, ...(automation.activityLog || [])].slice(0, 30)
              });
            } else {
              failed++;
            }
          }
        }
      }
    }

    // 4. INACTIVITY_DAYS (Win-Back inactive customers)
    else if (triggerType === 'INACTIVITY_DAYS') {
      const inactivityDays = Number(automation.triggerConfig?.value || 15);
      const minOrders = Number(automation.audienceConfig?.minOrders || 1);
      const minSpend = Number(automation.audienceConfig?.minSpend || 0);

      const candidates = getCandidateCustomers();

      for (const cust of candidates) {
        if (!cust.phone) continue;
        if (cust.totalOrders < minOrders || cust.totalSpent < minSpend) continue;

        const lastVisitMs = cust.lastVisit ? new Date(cust.lastVisit).getTime() : new Date(cust.createdAt).getTime();
        const daysSince = (now.getTime() - lastVisitMs) / (1000 * 60 * 60 * 24);

        if (daysSince >= inactivityDays) {
          const cooldownDays = Number(automation.timingConfig?.cooldownDays ?? automation.frequencyLimitDays ?? 30);
          const lastSent = db.getAutomationLastDispatchedToRecipient(automation.id, cust.phone);
          if (lastSent && (now.getTime() - lastSent.getTime()) < cooldownDays * 86400000) {
            continue;
          }

          processed++;

          if (automation.channel === 'WHATSAPP') {
            if (!isWaConnected) {
              failed++;
              continue;
            }

            const rawTemplate = automation.actionConfig?.messageTemplate || 'Hi {{customer_name}}, we miss you at {{restaurant_name}}!';
            const rendered = renderAutomationMessage(rawTemplate, cust.name, undefined, cust);

            const sendRes = await WhatsAppService.sendTextMessage(restaurantId, cust.phone, rendered);
            if (sendRes.success) {
              sent++;
              db.recordAutomationDispatch(automation.id, 'customer', cust.id, cust.phone, 'SUCCESS');
              const successLog = {
                id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                event: 'Win-back offer dispatched',
                timestamp: now.toISOString(),
                details: `Dispatched win-back message to inactive guest ${cust.name} (${cust.phone})`,
                type: 'SUCCESS' as const
              };
              db.updateAiAutomation(restaurantId, automation.id, {
                customersReached: (automation.customersReached || 0) + 1,
                messagesSent: (automation.messagesSent || 0) + 1,
                lastRun: now.toISOString(),
                activityLog: [successLog, ...(automation.activityLog || [])].slice(0, 30)
              });
            }
          }
        }
      }
    }

    // 5. BIRTHDAY
    else if (triggerType === 'BIRTHDAY') {
      const candidates = getCandidateCustomers();
      const todayMonth = now.getMonth();
      const todayDate = now.getDate();

      for (const cust of candidates) {
        if (!cust.phone) continue;
        const bday = (cust as any).birthday ? new Date((cust as any).birthday) : null;
        if (!bday) continue;

        if (bday.getMonth() === todayMonth && bday.getDate() === todayDate) {
          const lastSent = db.getAutomationLastDispatchedToRecipient(automation.id, cust.phone);
          if (lastSent && (now.getTime() - lastSent.getTime()) < 300 * 86400000) {
            continue;
          }

          processed++;
          if (isWaConnected && automation.channel === 'WHATSAPP') {
            const rawTemplate = automation.actionConfig?.messageTemplate || 'Happy Birthday, {{customer_name}}!';
            const rendered = renderAutomationMessage(rawTemplate, cust.name, undefined, cust);

            const sendRes = await WhatsAppService.sendTextMessage(restaurantId, cust.phone, rendered);
            if (sendRes.success) {
              sent++;
              db.recordAutomationDispatch(automation.id, 'customer', cust.id, cust.phone, 'SUCCESS');
              db.updateAiAutomation(restaurantId, automation.id, {
                customersReached: (automation.customersReached || 0) + 1,
                messagesSent: (automation.messagesSent || 0) + 1,
                lastRun: now.toISOString()
              });
            }
          }
        }
      }
    }

    // 6. VISIT_MILESTONE
    else if (triggerType === 'VISIT_MILESTONE') {
      const milestoneTarget = Number(automation.triggerConfig?.value || 5);
      const candidates = getCandidateCustomers();

      for (const cust of candidates) {
        if (cust.totalOrders >= milestoneTarget && cust.phone) {
          if (db.isAutomationDispatched(automation.id, 'milestone', `${cust.id}_${milestoneTarget}`)) {
            continue;
          }

          processed++;
          if (isWaConnected && automation.channel === 'WHATSAPP') {
            const rawTemplate = automation.actionConfig?.messageTemplate || 'Thank you for your loyalty, {{customer_name}}!';
            const rendered = renderAutomationMessage(rawTemplate, cust.name, undefined, cust);

            const sendRes = await WhatsAppService.sendTextMessage(restaurantId, cust.phone, rendered);
            if (sendRes.success) {
              sent++;
              db.recordAutomationDispatch(automation.id, 'milestone', `${cust.id}_${milestoneTarget}`, cust.phone, 'SUCCESS');
              db.updateAiAutomation(restaurantId, automation.id, {
                customersReached: (automation.customersReached || 0) + 1,
                messagesSent: (automation.messagesSent || 0) + 1,
                lastRun: now.toISOString()
              });
            }
          }
        }
      }
    }

    return { processed, sent, failed };
  }
}
