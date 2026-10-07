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
        const activeAutomated = campaigns.filter(
          c =>
            (c.status === 'RUNNING' || c.status === 'APPROVED') ||
            (c.mode === 'AUTOMATIC' && c.status !== 'CANCELLED' && c.status !== 'PAUSED' && c.status !== 'COMPLETED')
        );

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
    // Default interval is 7 days if not specified
    const intervalDays = (campaign as any).intervalDays || 7;
    const cooldownDays = (campaign as any).cooldownDays || 10;
    const isImmediate = (campaign as any).scheduleType === 'IMMEDIATE' || (campaign as any).status === 'APPROVED' || (campaign as any).status === 'RUNNING';

    // Filter target segment based on interval days
    const eligibleCustomers: Customer[] = [];

    for (const cust of allCustomers) {
      if (!cust.phone || cust.phone.length < 10) continue;

      const lastVisitTime = new Date(cust.lastVisit).getTime();
      const daysSinceVisit = Math.floor((now.getTime() - lastVisitTime) / (1000 * 60 * 60 * 24));

      let matchesSegment = false;

      if (isImmediate) {
        // Immediate campaigns target all members of the cohort immediately without interval delays
        switch (campaign.audienceSegment) {
          case 'AT_RISK':
          case 'INACTIVE':
            matchesSegment = cust.status === 'AT_RISK' || cust.status === 'INACTIVE' || daysSinceVisit >= 14;
            break;

          case 'NEW':
            matchesSegment = cust.totalOrders <= 1 || cust.status === 'NEW';
            break;

          case 'VIP':
            matchesSegment = cust.status === 'VIP' || cust.totalSpent >= 5000;
            break;

          case 'REGULAR':
            matchesSegment = cust.status === 'REGULAR' || cust.totalOrders >= 2;
            break;

          case 'ALL':
          default:
            matchesSegment = true;
            break;
        }
      } else {
        // Scheduled recurring automation rules
        switch (campaign.audienceSegment) {
          case 'AT_RISK':
          case 'INACTIVE':
            matchesSegment = daysSinceVisit >= intervalDays || cust.status === 'AT_RISK';
            break;

          case 'NEW':
            matchesSegment = (cust.totalOrders === 1 || cust.status === 'NEW') && daysSinceVisit >= Math.min(3, intervalDays);
            break;

          case 'VIP':
            matchesSegment = (cust.status === 'VIP' || cust.totalSpent >= 5000) && daysSinceVisit >= intervalDays;
            break;

          case 'REGULAR':
            matchesSegment = cust.status === 'REGULAR' && daysSinceVisit >= intervalDays;
            break;

          default:
            matchesSegment = daysSinceVisit >= intervalDays;
            break;
        }
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

    if (eligibleCustomers.length === 0) {
      return { eligible: 0, sent: 0 };
    }

    // Limit batch to max 25 recipients per automation run to protect WhatsApp reputation
    const batch = eligibleCustomers.slice(0, 25);
    let sentCount = 0;

    // Prepare personalized messages
    const messageQueue: Array<{ phone: string; text: string }> = [];

    for (const cust of batch) {
      const personalizedText = this.renderTemplate(campaign.messageTemplate, cust, restaurant, campaign);
      messageQueue.push({
        phone: cust.phone,
        text: personalizedText
      });
    }

    // Dispatch via connected WhatsApp if active
    if (isWaConnected && campaign.channel === 'WHATSAPP') {
      const result = await WhatsAppService.sendBatchWithDelay(restaurantId, messageQueue);
      sentCount = result.sent;
    } else {
      // If WhatsApp is not connected, record count for preview
      sentCount = messageQueue.length;
    }

    // Credit bonus coins if configured
    if (campaign.offerType === 'DISCOUNT_COINS' && campaign.offerValue > 0) {
      for (const cust of batch) {
        const adjustRes = db.adjustCustomerCoins(
          restaurantId,
          cust.id,
          campaign.offerValue,
          `Campaign Bonus: ${campaign.name}`
        );
        if (adjustRes) {
          emitCustomerCoinsUpdated(restaurantId, adjustRes.customer);
        }
      }
    }

    // Update customer last messaged timestamp in memory
    for (const cust of batch) {
      (cust as any).lastCampaignMessageAt = new Date().toISOString();
    }

    // Update campaign statistics
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
   * Render template variables into personalized copy
   */
  public static renderTemplate(
    template: string,
    customer: Customer,
    restaurant: any,
    campaign: AiCampaign
  ): string {
    const coins = campaign.offerType === 'DISCOUNT_COINS' ? campaign.offerValue : customer.coinBalance || 50;
    const rupeeValue = Math.round(coins * 0.5); // ₹0.50 per coin
    const orderLink = `https://swaadsevak.vercel.app/m/${restaurant.slug}`;

    return template
      .replace(/\{\{customer_name\}\}/g, customer.name || 'Food Lover')
      .replace(/\{\{restaurant_name\}\}/g, restaurant.name || 'Our Restaurant')
      .replace(/\{\{discount_coins\}\}/g, String(coins))
      .replace(/\{\{discount_value\}\}/g, String(rupeeValue))
      .replace(/\{\{discount_expiry\}\}/g, '7 days')
      .replace(/\{\{order_link\}\}/g, orderLink);
  }
}
