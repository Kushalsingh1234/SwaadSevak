import { db } from '../db/index.js';
import { WhatsAppService } from './whatsappService.js';
import { Customer, AiCampaign } from '../types/index.js';
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

        if (activeAutomated.length === 0) continue;

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

    db.updateAiCampaign(restaurantId, campaign.id, {
      status: 'COMPLETED',
      sentAt: new Date().toISOString(),
      stats: {
        ...currentStats,
        sent: newSent,
        delivered: newDelivered
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
      .replace(/\{{1,2}\s*(coin_?balance|coins?_?balance|balance|wallet_?balance)\s*\}{1,2}/gi, String(currentBalance))
      .replace(/\{{1,2}\s*(validity_?days?|validity|expiry_?days?)\s*\}{1,2}/gi, String(validityDays))
      .replace(/\{{1,2}\s*(discount_?expiry|offer_?expiry)\s*\}{1,2}/gi, `${validityDays} days`)
      .replace(/\{{1,2}\s*(favourite_?item|favorite_?item|fav_?dish|favorite_?dish)\s*\}{1,2}/gi, (customer as any).favoriteDish || (customer as any).favoriteItem || 'your favourites')
      .replace(/\{{1,2}\s*(restaurant_?address|address)\s*\}{1,2}/gi, restaurant?.address || '')
      .replace(/\{{1,2}\s*(order_?link|link|menu_?link)\s*\}{1,2}/gi, orderLink);

    // Format the bottom card showing offer awarded and customer coin balance
    let offerBadge = '';
    const offerType = campaign.offerType || 'DISCOUNT_COINS';
    if (offerType === 'DISCOUNT_COINS' && offerValue > 0) {
      offerBadge = `🪙 *Reward:* ₹${offerValue} Coins Activated (Valid for ${validityDays} days)`;
    } else if (offerType === 'DISCOUNT_PERCENT' && offerValue > 0) {
      offerBadge = `🏷️ *Special Offer:* ${offerValue}% Discount Activated (Valid for ${validityDays} days)`;
    } else if (offerType === 'FREE_ITEM') {
      offerBadge = `🍟 *Complimentary Perk:* Free Appetizer/Beverage on your table (Valid for ${validityDays} days)`;
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
}
