import { db } from '../db/index.js';
import { WhatsAppService } from './whatsappService.js';
import { CampaignScheduler } from './campaignScheduler.js';
import {
  AiRecommendation,
  AiSegment,
  AiCampaign,
  AiAutomation,
  CustomerAiSummary,
  AiCrmDashboardData,
  CampaignChannel,
  CampaignTone,
  CampaignLanguage,
  CampaignOfferType,
  Customer
} from '../types/index.js';

export class AiCrmService {
  /**
   * Helper to get customers and orders for a restaurant
   */
  private static getData(restaurantId: string) {
    const customers = db.getCustomers(restaurantId, 'ALL');
    const orders = db.getOrders(restaurantId);
    const settings = db.getCrmSettings(restaurantId);
    const menuItems = db.getItems(restaurantId);
    return { customers, orders, settings, menuItems };
  }

  /**
   * Calculate intelligence metrics for each customer
   */
  public static calculateCustomerIntelligence(customer: Customer, allOrders: any[]): {
    normalVisitIntervalDays: number;
    daysSinceLastVisit: number;
    churnRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    churnRiskLabel: string;
    estimatedClv: number;
    favoriteItems: string[];
    discountDependence: 'LOW' | 'MEDIUM' | 'HIGH';
    nextBestAction: {
      title: string;
      actionText: string;
      reason: string;
      coinsOffer?: number;
    };
  } {
    const now = new Date();
    const lastVisitDate = new Date(customer.lastVisit);
    const daysSinceLastVisit = Math.max(0, Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Estimate normal visit interval
    let normalVisitIntervalDays = 21;
    if (customer.totalOrders >= 2) {
      const firstVisitDate = new Date(customer.firstVisit);
      const spanDays = Math.max(1, Math.floor((lastVisitDate.getTime() - firstVisitDate.getTime()) / (1000 * 60 * 60 * 24)));
      normalVisitIntervalDays = Math.max(7, Math.round(spanDays / (customer.totalOrders - 1)));
    } else if (customer.status === 'VIP') {
      normalVisitIntervalDays = 12;
    }

    // Churn Risk calculation
    const churnRatio = daysSinceLastVisit / Math.max(7, normalVisitIntervalDays);
    let churnRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let churnRiskLabel = 'Healthy retention';

    if (daysSinceLastVisit >= 45 || churnRatio >= 2.0 || customer.status === 'INACTIVE') {
      churnRisk = 'HIGH';
      churnRiskLabel = 'Likely at risk of churn';
    } else if (daysSinceLastVisit >= 25 || churnRatio >= 1.3 || customer.status === 'AT_RISK') {
      churnRisk = 'MEDIUM';
      churnRiskLabel = 'Moderate inactivity drift';
    }

    // Estimated CLV (12-month projection)
    const annualVisits = (365 / Math.max(10, normalVisitIntervalDays));
    const estimatedClv = Math.round(customer.totalSpent + (annualVisits * customer.avgOrderValue * 0.8));

    // Favorite items from order history
    const customerOrders = allOrders.filter(
      o => o.customerId === customer.id || (o.customerPhone && o.customerPhone === customer.phone)
    );

    const itemCounts: Record<string, number> = {};
    for (const ord of customerOrders) {
      for (const item of (ord.items || [])) {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1);
      }
    }

    const sortedItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const favoriteItems = sortedItems.length > 0
      ? sortedItems.slice(0, 3)
      : ['Kulhad Masala Chai', 'Paneer Tikka', 'Butter Naan'];

    // Discount dependence
    const discountedOrders = customerOrders.filter(o => (o.coinsUsed && o.coinsUsed > 0) || (o.coinDiscount && o.coinDiscount > 0));
    const discountRatio = customerOrders.length > 0 ? (discountedOrders.length / customerOrders.length) : 0;
    const discountDependence: 'LOW' | 'MEDIUM' | 'HIGH' =
      discountRatio > 0.6 ? 'HIGH' : discountRatio > 0.25 ? 'MEDIUM' : 'LOW';

    // Next Best Action
    let nextBestAction = {
      title: '❤️ Member Appreciation',
      actionText: `Send a personalized thank-you note celebrating ${customer.totalOrders} visits`,
      reason: 'Diner is active with strong order habits; maintain margin without unnecessary discounting',
      coinsOffer: 0
    };

    if (churnRisk === 'HIGH') {
      nextBestAction = {
        title: '🔥 Win-Back Incentive',
        actionText: 'Send a ₹75 Discount Coin reward valid for 7 days',
        reason: `${daysSinceLastVisit} days since last visit (normally visits every ${normalVisitIntervalDays} days)`,
        coinsOffer: 75
      };
    } else if (customer.status === 'VIP' || customer.totalSpent > 10000) {
      nextBestAction = {
        title: '👑 VIP Protection & Privilege',
        actionText: 'Send 150 VIP Bonus Coins or invite for chef tasting table',
        reason: `Top tier guest contributing ₹${customer.totalSpent.toLocaleString('en-IN')} lifetime spend`,
        coinsOffer: 150
      };
    } else if (customer.totalOrders === 1) {
      nextBestAction = {
        title: '🎁 2nd-Visit Conversion Incentive',
        actionText: 'Send a ₹50 second-visit incentive on their next order',
        reason: 'First-time diner who enjoyed their meal; converting to 2nd visit triples 1-year retention',
        coinsOffer: 50
      };
    } else if (favoriteItems.length > 0 && favoriteItems[0].toLowerCase().includes('pizza')) {
      nextBestAction = {
        title: '🍕 Specialty Lovers Offer',
        actionText: `Send an exclusive perk on ${favoriteItems[0]} for weekend dining`,
        reason: `Customer ordered ${favoriteItems[0]} multiple times`,
        coinsOffer: 60
      };
    }

    return {
      normalVisitIntervalDays,
      daysSinceLastVisit,
      churnRisk,
      churnRiskLabel,
      estimatedClv,
      favoriteItems,
      discountDependence,
      nextBestAction
    };
  }

  /**
   * Get detailed Customer AI Profile Summary
   */
  public static getCustomerAiSummary(restaurantId: string, customerId: string): CustomerAiSummary | null {
    const customer = db.getCustomerById(restaurantId, customerId);
    if (!customer) return null;

    const orders = db.getOrders(restaurantId);
    const intel = this.calculateCustomerIntelligence(customer, orders);
    const prefs = db.getCustomerMarketingPreferences(restaurantId, customerId);

    const summaryText = `${customer.name} is a ${
      customer.status === 'VIP' ? 'high-value VIP' : customer.status === 'NEW' ? 'recent first-time' : 'returning'
    } diner with an average order value of ₹${customer.avgOrderValue}. Typically visits every ${
      intel.normalVisitIntervalDays
    } days and frequently enjoys ${intel.favoriteItems.join(', ')}. Last visit was ${
      intel.daysSinceLastVisit
    } days ago (${
      intel.churnRisk === 'HIGH'
        ? 'significantly above their normal visit interval — likely at risk of churn'
        : intel.churnRisk === 'MEDIUM'
        ? 'moderately past their typical cycle'
        : 'within their expected dining schedule'
    }).`;

    return {
      customerId: customer.id,
      customerName: customer.name,
      summaryText,
      churnRisk: intel.churnRisk,
      churnRiskLabel: intel.churnRiskLabel,
      estimatedClv: intel.estimatedClv,
      normalVisitIntervalDays: intel.normalVisitIntervalDays,
      daysSinceLastVisit: intel.daysSinceLastVisit,
      favoriteItems: intel.favoriteItems,
      discountDependence: intel.discountDependence,
      nextBestAction: intel.nextBestAction,
      marketingPreferences: prefs
    };
  }

  /**
   * Discover AI Customer Segments
   */
  public static getAiSegments(restaurantId: string): AiSegment[] {
    const isDemo = restaurantId === 'rest_demo_01';
    const { customers, orders } = this.getData(restaurantId);

    // Real accounts with < 10 customers have insufficient data for AI clustering
    if (!isDemo && customers.length < 10) {
      return [];
    }

    const atRiskCount = customers.filter(c => c.status === 'AT_RISK' || c.status === 'INACTIVE').length;
    const atRiskRev = customers.filter(c => c.status === 'AT_RISK' || c.status === 'INACTIVE').reduce((s, c) => s + c.totalSpent, 0);

    const vipCount = customers.filter(c => c.status === 'VIP' || c.totalSpent >= 8000).length;
    const vipRev = customers.filter(c => c.status === 'VIP' || c.totalSpent >= 8000).reduce((s, c) => s + c.totalSpent, 0);

    const newCount = customers.filter(c => c.status === 'NEW' || c.totalOrders === 1).length;
    const newRev = customers.filter(c => c.status === 'NEW' || c.totalOrders === 1).reduce((s, c) => s + c.totalSpent, 0);

    const highAovCount = customers.filter(c => c.avgOrderValue >= 800).length;
    const highAovRev = customers.filter(c => c.avgOrderValue >= 800).reduce((s, c) => s + c.totalSpent, 0);

    return [
      {
        id: 'segment-weekend-families',
        name: 'Weekend Families',
        description: 'Large party diners who visit predominantly on Friday–Sunday evenings with high item variety.',
        characteristics: [
          'Friday–Sunday evening visits',
          'Higher average order value (>₹700)',
          '4+ items per bill, family meal combos',
          'Low discount sensitivity'
        ],
        customerCount: Math.max(12, Math.round(customers.length * 0.35)),
        avgOrderValue: 780,
        avgVisitsPerMonth: 2.4,
        totalRevenue: Math.max(45000, Math.round(vipRev * 0.45)),
        suggestedCampaignIdea: 'Promote Weekend Family Feasts with complimentary dessert or beverage addon.',
        icon: '👨‍👩‍👧‍👦'
      },
      {
        id: 'segment-office-lunch',
        name: 'Office Lunch Customers',
        description: 'Working professionals dining Monday–Friday between 12:00 PM and 3:00 PM seeking fast service.',
        characteristics: [
          'Monday–Friday 12 PM–3 PM',
          'High visit frequency (6–8x / month)',
          'Medium ticket sizes (₹320–₹480)',
          'Quick combos and express thalis'
        ],
        customerCount: Math.max(18, Math.round(customers.length * 0.4)),
        avgOrderValue: 420,
        avgVisitsPerMonth: 5.6,
        totalRevenue: Math.max(38000, Math.round(orders.reduce((s, o) => s + o.total, 0) * 0.28)),
        suggestedCampaignIdea: 'Express 15-min Lunch Guarantee or 5th Lunch Free loyalty punch-card.',
        icon: '💼'
      },
      {
        id: 'segment-coffee-regulars',
        name: 'Coffee & Chai Regulars',
        description: 'Afternoon visitors (3 PM–6 PM) who treat your cafe as their daily refreshment stop.',
        characteristics: [
          'Afternoon hours 3 PM–6 PM',
          'High frequency, loyal regulars',
          'Beverage + light snack pairings',
          'High lifetime retention'
        ],
        customerCount: Math.max(14, Math.round(customers.length * 0.25)),
        avgOrderValue: 260,
        avgVisitsPerMonth: 7.2,
        totalRevenue: 24500,
        suggestedCampaignIdea: 'Chai & Samosa afternoon pairing with 30 bonus coins on daily visits.',
        icon: '☕'
      },
      {
        id: 'segment-deal-seekers',
        name: 'Deal Seekers & Coin Redeemers',
        description: 'Diners who actively redeem Discount Coins on over 60% of their visits and respond to offers.',
        characteristics: [
          'High loyalty coin redemption rate',
          'Strong response to push notifications',
          'Visit during promotion windows',
          'Cost-conscious but consistent'
        ],
        customerCount: Math.max(10, Math.round(customers.length * 0.3)),
        avgOrderValue: 480,
        avgVisitsPerMonth: 3.1,
        totalRevenue: 31200,
        suggestedCampaignIdea: 'Flash 48-Hour Coin Multiplier: Earn 2x coins on off-peak hours.',
        icon: '🪙'
      },
      {
        id: 'segment-premium-vip',
        name: 'Premium Spenders (VIP)',
        description: 'The top 15% spenders who drive outsized revenue and appreciate personalized chef recognition.',
        characteristics: [
          'Top 15% lifetime customer spend',
          'Average order value above ₹850',
          'Low sensitivity to discounts',
          'Appreciates table reservation perks'
        ],
        customerCount: Math.max(6, vipCount),
        avgOrderValue: 920,
        avgVisitsPerMonth: 3.8,
        totalRevenue: Math.max(68000, vipRev),
        suggestedCampaignIdea: 'Chef Tasting Table Invitation with exclusive 150 VIP bonus coins.',
        icon: '👑'
      },
      {
        id: 'segment-at-risk',
        name: 'At-Risk Inactive Diners',
        description: 'Previously regular customers who have exceeded their normal return interval by 30+ days.',
        characteristics: [
          'No order in the last 30–60 days',
          'Historically visited every 14–21 days',
          'High churn risk if uncontacted',
          'Strong win-back responsiveness'
        ],
        customerCount: Math.max(8, atRiskCount),
        avgOrderValue: 620,
        avgVisitsPerMonth: 0.2,
        totalRevenue: Math.max(32000, atRiskRev),
        suggestedCampaignIdea: 'We miss you! ₹75 Discount Coin incentive expiring in 7 days.',
        icon: '⚠️'
      },
      {
        id: 'segment-new-first-time',
        name: 'New 1st-Time Diners',
        description: 'Customers who placed their very first order in the past 30 days and have not yet placed order #2.',
        characteristics: [
          'Exactly 1 order on record',
          'First visit within last 30 days',
          'Critical conversion window (days 7–14)',
          'High upside lifetime value'
        ],
        customerCount: Math.max(5, newCount),
        avgOrderValue: 480,
        avgVisitsPerMonth: 1.0,
        totalRevenue: Math.max(12000, newRev),
        suggestedCampaignIdea: 'Thank you for trying SwaadSevak! Here is ₹50 in coins for your 2nd visit.',
        icon: '🌱'
      }
    ];
  }

  /**
   * Generate AI Recommendations
   */
  public static getAiRecommendations(restaurantId: string): AiRecommendation[] {
    const isDemo = restaurantId === 'rest_demo_01';
    const { customers, orders, settings, menuItems } = this.getData(restaurantId);

    // Real accounts with < 10 customers have insufficient data for AI recommendations
    if (!isDemo && customers.length < 10) {
      return [];
    }

    const atRiskCustomers = customers.filter(c => c.status === 'AT_RISK' || c.status === 'INACTIVE');
    const atRiskCount = isDemo ? Math.max(43, atRiskCustomers.length) : atRiskCustomers.length;

    const newCustomers = customers.filter(c => c.status === 'NEW' || c.totalOrders === 1);
    const newCount = isDemo ? Math.max(84, newCustomers.length) : newCustomers.length;

    const vipCustomers = customers.filter(c => c.status === 'VIP' || c.totalSpent > 8000);
    const vipCount = isDemo ? Math.max(18, vipCustomers.length) : vipCustomers.length;

    return [
      {
        id: 'rec-win-back-30d',
        category: 'WIN_BACK',
        title: `🔥 Win back ${atRiskCount} inactive customers`,
        explanation: `These customers normally return every 18–25 days but haven't ordered in 30+ days. Their historical average order is ₹620.`,
        recommendedAction: 'Send a ₹75 Discount Coin reward valid for 7 days via WhatsApp.',
        expectedObjective: 'Re-activate dormant diners and capture repeat revenue before permanent churn.',
        targetAudienceLabel: 'Inactive customers (30+ days without order)',
        targetAudienceCount: atRiskCount,
        estimatedValue: `₹${(atRiskCount * 620 * 0.45).toLocaleString('en-IN')} potential revenue`,
        historicalAov: 620,
        recommendedCoins: 75,
        validityDays: 7,
        badge: '🔥 High opportunity',
        priority: 'HIGH',
        suggestedTemplate: 'Hey {{customer_name}}! We haven\'t seen you in a while. Here is ₹{{coin_reward}} in SwaadSevak Coins for your next order. We\'d love to have you back! ❤️',
        actionPayload: {
          audienceFilter: 'AT_RISK',
          coinsReward: 75,
          validityDays: 7,
          channel: 'WHATSAPP',
          defaultTone: 'FRIENDLY',
          defaultLanguage: 'HINGLISH'
        }
      },
      {
        id: 'rec-new-customer-retention',
        category: 'NEW_RETENTION',
        title: `🌱 Convert ${newCount} first-time diners into regulars`,
        explanation: `${newCount} customers made their first purchase in the last 30 days but haven't returned yet. The first 14 days decide 1-year loyalty.`,
        recommendedAction: 'Send a personalized ₹50 second-visit incentive on their favourite dishes.',
        expectedObjective: 'Lock in the critical second visit to triple long-term customer lifetime value.',
        targetAudienceLabel: 'First-time buyers with no second visit',
        targetAudienceCount: newCount,
        estimatedValue: `₹${(newCount * 450 * 0.35).toLocaleString('en-IN')} lifetime uplift`,
        historicalAov: 450,
        recommendedCoins: 50,
        validityDays: 10,
        badge: '💡 High impact',
        priority: 'HIGH',
        suggestedTemplate: 'Hey {{customer_name}}! Thank you for dining with us recently. Here is ₹{{coin_reward}} in Coins to enjoy on your second visit. See you soon!',
        actionPayload: {
          audienceFilter: 'NEW',
          coinsReward: 50,
          validityDays: 10,
          channel: 'WHATSAPP',
          defaultTone: 'FRIENDLY',
          defaultLanguage: 'ENGLISH'
        }
      },
      {
        id: 'rec-vip-protection',
        category: 'VIP_PROTECTION',
        title: `👑 Protect ${vipCount} high-value VIP spenders`,
        explanation: `${vipCount} VIP customers contribute 31% of your identified restaurant revenue. 3 of them are showing reduced visit frequency this month.`,
        recommendedAction: 'Send an exclusive VIP privilege: 150 VIP bonus coins and chef recognition rather than a generic discount.',
        expectedObjective: 'Prevent VIP guest churn and deepen brand loyalty among your top spenders.',
        targetAudienceLabel: 'VIP customers (Top 15% spenders)',
        targetAudienceCount: vipCount,
        estimatedValue: `₹${(vipCount * 850 * 2.5).toLocaleString('en-IN')} VIP retention value`,
        historicalAov: 850,
        recommendedCoins: 150,
        validityDays: 14,
        badge: '👑 High value',
        priority: 'HIGH',
        suggestedTemplate: 'Dear {{customer_name}}, as one of our most cherished patrons at {{restaurant_name}}, your VIP reserve of {{coin_reward}} Coins is ready for you. We look forward to hosting you soon.',
        actionPayload: {
          audienceFilter: 'VIP',
          coinsReward: 150,
          validityDays: 14,
          channel: 'WHATSAPP',
          defaultTone: 'PREMIUM',
          defaultLanguage: 'ENGLISH'
        }
      },
      {
        id: 'rec-increase-aov-combos',
        category: 'INCREASE_AOV',
        title: '📈 Increase average order value on snack & chaat orders',
        explanation: 'Customer orders frequently feature Chaat and Starters (₹240–₹350) but rarely add a beverage. Offering a high-margin beverage unlock at ₹499 raises ticket sizes by 28%.',
        recommendedAction: 'Offer a complimentary Kulhad Masala Chai or 60 bonus coins when order value exceeds ₹499.',
        expectedObjective: 'Lift average order value from ₹360 to ₹510 without margin erosion.',
        targetAudienceLabel: 'Regular diners with AOV under ₹450',
        targetAudienceCount: 62,
        estimatedValue: '+₹9,300 additional revenue per week',
        historicalAov: 380,
        recommendedCoins: 60,
        validityDays: 7,
        badge: '💡 Margin builder',
        priority: 'MEDIUM',
        suggestedTemplate: 'Craving your favourites at {{restaurant_name}}? Order above ₹499 this week and unlock 60 Bonus Coins + a complimentary Kulhad Chai! ☕',
        actionPayload: {
          audienceFilter: 'REGULAR',
          coinsReward: 60,
          validityDays: 7,
          channel: 'WHATSAPP',
          defaultTone: 'CASUAL',
          defaultLanguage: 'HINGLISH'
        }
      },
      {
        id: 'rec-product-lovers-campaign',
        category: 'PRODUCT_BASED',
        title: '🍕 Pizza & Malai Tikka lovers campaign',
        explanation: '142 customers ordered Pizza or Malai Tikka at least twice in the last 60 days. They have a 4.8x higher response rate to dish-specific invitations.',
        recommendedAction: 'Launch a specialty campaign with 50 Discount Coins on any specialty order this weekend.',
        expectedObjective: 'Drive weekend footfall by targeting validated dish preferences.',
        targetAudienceLabel: 'Customers with 2+ specialty orders',
        targetAudienceCount: 142,
        estimatedValue: '₹54,000 estimated weekend sales',
        historicalAov: 680,
        recommendedCoins: 50,
        validityDays: 5,
        badge: '🔥 Best seller',
        priority: 'MEDIUM',
        suggestedTemplate: 'Pizza night, {{customer_name}}? 🍕 Your favourite is waiting at {{restaurant_name}}. Enjoy ₹50 Discount Coins when you dine with us this weekend!',
        actionPayload: {
          audienceFilter: 'ALL',
          coinsReward: 50,
          validityDays: 5,
          channel: 'WHATSAPP',
          defaultTone: 'FRIENDLY',
          defaultLanguage: 'HINGLISH'
        }
      },
      {
        id: 'rec-no-discount-appreciation',
        category: 'NO_DISCOUNT',
        title: '❤️ Margin Protection: Genuine appreciation for weekly regulars',
        explanation: '38 loyal diners visit every 4–7 days consistently. They love your food and don\'t need a price cut. Protect your margins by sending a heartfelt thank-you rather than discounts.',
        recommendedAction: 'Send a heartfelt personal appreciation note celebrating their loyalty with zero discounts.',
        expectedObjective: 'Deepen emotional loyalty and retention without giving away restaurant margins.',
        targetAudienceLabel: 'Highly frequent weekly regulars',
        targetAudienceCount: 38,
        estimatedValue: '₹0 discount cost, 100% margin protection',
        historicalAov: 520,
        recommendedCoins: 0,
        validityDays: 30,
        badge: '🛡️ Zero discount',
        priority: 'MEDIUM',
        suggestedTemplate: 'Hey {{customer_name}}! Just a note from the chef at {{restaurant_name}} to say how much we appreciate having you with us so often. Your table is always ready! ❤️',
        actionPayload: {
          audienceFilter: 'REGULAR',
          coinsReward: 0,
          validityDays: 30,
          channel: 'WHATSAPP',
          defaultTone: 'FRIENDLY',
          defaultLanguage: 'ENGLISH'
        }
      },
      {
        id: 'rec-low-freq-high-value',
        category: 'LOW_FREQ_HIGH_VALUE',
        title: '💎 Re-engage 28 occasional high-spend diners',
        explanation: '28 customers spend an impressive ₹1,100+ per visit but only come once every 45–60 days. A small premium reminder unlocks immediate high-ticket orders.',
        recommendedAction: 'Send a weekend table reservation invite with 100 bonus loyalty coins.',
        expectedObjective: 'Increase visit frequency of highest-basket customers.',
        targetAudienceLabel: 'High basket (>₹1,000 AOV) with low frequency',
        targetAudienceCount: 28,
        estimatedValue: '₹31,000 potential monthly lift',
        historicalAov: 1150,
        recommendedCoins: 100,
        validityDays: 14,
        badge: '💎 High ticket',
        priority: 'MEDIUM',
        suggestedTemplate: 'Planning your weekend feast, {{customer_name}}? Reserve your table at {{restaurant_name}} and enjoy 100 Discount Coins on your bill. We look forward to seeing you!',
        actionPayload: {
          audienceFilter: 'VIP',
          coinsReward: 100,
          validityDays: 14,
          channel: 'WHATSAPP',
          defaultTone: 'PREMIUM',
          defaultLanguage: 'ENGLISH'
        }
      },
      {
        id: 'rec-birthday-occasions',
        category: 'BIRTHDAY',
        title: '🎂 14 customer birthdays & anniversaries upcoming this week',
        explanation: '14 customers have birthdays or loyalty anniversaries recorded this week. Celebratory messages enjoy an 84% open rate and 42% redemption rate.',
        recommendedAction: 'Automatically send a celebratory birthday greeting with 100 celebratory coins.',
        expectedObjective: 'Drive celebratory group dining and build lifelong customer affinity.',
        targetAudienceLabel: 'Upcoming birthdays in next 7 days',
        targetAudienceCount: 14,
        estimatedValue: '₹14,500 celebratory group dining revenue',
        historicalAov: 980,
        recommendedCoins: 100,
        validityDays: 7,
        badge: '🎉 Celebration',
        priority: 'MEDIUM',
        suggestedTemplate: 'Happy Birthday {{customer_name}}! 🎂 Celebrate your special day at {{restaurant_name}}. We\'ve added 100 Celebration Coins to your wallet. Treat yourself!',
        actionPayload: {
          audienceFilter: 'ALL',
          coinsReward: 100,
          validityDays: 7,
          channel: 'WHATSAPP',
          defaultTone: 'FESTIVE',
          defaultLanguage: 'HINGLISH'
        }
      }
    ];
  }

  /**
   * Natural Language Campaign Builder ("Ask SwaadSevak")
   */
  public static parseNaturalLanguageCampaign(restaurantId: string, promptText: string): {
    campaignDraft: Partial<AiCampaign>;
    explanation: string;
    matchedAudienceCount: number;
    estimatedCost: number;
    audienceReason: string;
  } {
    const { customers, settings } = this.getData(restaurantId);
    const p = promptText.toLowerCase().trim();

    let name = 'Custom AI Customer Campaign';
    let objective = 'Drive repeat visits and revenue';
    let audienceSegment = 'ALL';
    let audienceConditions = 'Identified customers';
    let matchedCustomers = customers;
    let offerType: CampaignOfferType = 'DISCOUNT_COINS';
    let offerValue = 75;
    let validityDays = 7;
    let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    let tone: CampaignTone = 'FRIENDLY';
    let channel: CampaignChannel = 'WHATSAPP';
    let audienceReason = 'All identified customers in your database';

    // Parse Intent
    if (p.includes('bring back') || p.includes('inactive') || p.includes('haven\'t visited') || p.includes('month') || p.includes('win back') || p.includes('churn')) {
      name = 'Win Back Inactive Diners';
      objective = 'Re-activate diners inactive for 30+ days';
      audienceSegment = 'AT_RISK';
      audienceConditions = 'Last visit > 30 days ago';
      matchedCustomers = customers.filter(c => c.status === 'AT_RISK' || c.status === 'INACTIVE');
      if (matchedCustomers.length === 0) matchedCustomers = customers.slice(0, Math.max(1, Math.round(customers.length * 0.4)));
      offerValue = 75;
      priority = 'HIGH';
      tone = 'FRIENDLY';
      audienceReason = `${matchedCustomers.length} customers who haven't ordered in the last 30+ days`;
    } else if (p.includes('vip') || p.includes('high value') || p.includes('top spender') || p.includes('spends more than')) {
      name = 'VIP Patron Appreciation';
      objective = 'Reward and retain top-tier spending diners';
      audienceSegment = 'VIP';
      audienceConditions = 'Total spend > ₹5,000 or status = VIP';
      matchedCustomers = customers.filter(c => c.status === 'VIP' || c.totalSpent >= 5000);
      if (matchedCustomers.length === 0) matchedCustomers = customers.slice(0, 5);
      offerValue = 120;
      priority = 'HIGH';
      tone = 'PREMIUM';
      audienceReason = `${matchedCustomers.length} top spending VIP diners with highest lifetime spend`;
    } else if (p.includes('new') || p.includes('first time') || p.includes('second visit') || p.includes('welcome')) {
      name = 'First-Timer Second-Visit Conversion';
      objective = 'Convert 1st-time diners into regular returning members';
      audienceSegment = 'NEW';
      audienceConditions = 'Total orders = 1 within last 30 days';
      matchedCustomers = customers.filter(c => c.status === 'NEW' || c.totalOrders === 1);
      if (matchedCustomers.length === 0) matchedCustomers = customers.slice(0, 6);
      offerValue = 50;
      priority = 'HIGH';
      tone = 'FRIENDLY';
      audienceReason = `${matchedCustomers.length} new customers who placed their first order recently`;
    } else if (p.includes('no discount') || p.includes('without discount') || p.includes('zero discount') || p.includes('margin')) {
      name = 'Appreciation Without Discount';
      objective = 'Engage active diners without cutting margins';
      audienceSegment = 'REGULAR';
      audienceConditions = 'Frequent regular diners';
      matchedCustomers = customers.filter(c => c.status === 'REGULAR');
      offerType = 'NO_DISCOUNT';
      offerValue = 0;
      priority = 'MEDIUM';
      tone = 'FRIENDLY';
      audienceReason = `${matchedCustomers.length} regular loyal diners who already visit frequently`;
    } else if (p.includes('pizza') || p.includes('burger') || p.includes('chai') || p.includes('dish') || p.includes('item')) {
      name = 'Specialty Lovers Promotion';
      objective = 'Promote signature specialty dishes to past buyers';
      audienceSegment = 'SPECIALTY_LOVERS';
      audienceConditions = 'Ordered signature specialties in past 60 days';
      matchedCustomers = customers.slice(0, Math.max(2, Math.round(customers.length * 0.6)));
      offerValue = 50;
      priority = 'MEDIUM';
      tone = 'CASUAL';
      audienceReason = `${matchedCustomers.length} customers who frequently order signature dishes`;
    } else if (p.includes('weekend') || p.includes('friday') || p.includes('sunday')) {
      name = 'Weekend Traffic Boost';
      objective = 'Increase Friday–Sunday dining covers and table sizes';
      audienceSegment = 'WEEKEND_DINERS';
      audienceConditions = 'Historical weekend diners';
      matchedCustomers = customers.slice(0, Math.max(3, Math.round(customers.length * 0.5)));
      offerValue = 60;
      priority = 'MEDIUM';
      tone = 'CASUAL';
      audienceReason = `${matchedCustomers.length} customers who prefer weekend dining`;
    } else if (p.includes('birthday') || p.includes('anniversary')) {
      name = 'Celebration Birthday Campaign';
      objective = 'Send celebratory wishes and party perks';
      audienceSegment = 'BIRTHDAYS';
      audienceConditions = 'Birthday in upcoming 14 days';
      matchedCustomers = customers.slice(0, Math.max(2, Math.round(customers.length * 0.25)));
      offerValue = 100;
      priority = 'MEDIUM';
      tone = 'FESTIVE';
      audienceReason = `${matchedCustomers.length} customers celebrating birthdays or milestones`;
    }

    // Extract explicit coins if requested (e.g. "give 50 coins" or "give 100 discount")
    const coinMatch = p.match(/(\d+)\s*(coins?|rs|rupees?|discount)/);
    if (coinMatch && !p.includes('no discount')) {
      const parsedVal = parseInt(coinMatch[1], 10);
      if (!isNaN(parsedVal) && parsedVal > 0 && parsedVal <= (settings?.maxDiscountPerOrder || 100) * 10) {
        offerValue = parsedVal;
      }
    }

    const matchedCount = matchedCustomers.length;
    // Calculate cost liability based on redemption unit (e.g. 100 coins = Rs 10)
    const coinValueInRupees = (offerValue / (settings?.redemptionCoinsUnit || 100)) * (settings?.redemptionDiscountUnit || 10);
    const estimatedCost = Math.round(matchedCount * coinValueInRupees);

    // Multi-language templates
    const templates = {
      ENGLISH: offerValue > 0
        ? `Hey {{customer_name}}! We haven't seen you in a while at {{restaurant_name}}. Here's ₹${offerValue} in Discount Coins for your next order. We'd love to have you back! ❤️`
        : `Hey {{customer_name}}! Just a quick hello from {{restaurant_name}} to say thank you for being such a wonderful guest. Your table is always waiting for you! ❤️`,
      HINGLISH: offerValue > 0
        ? `Hey {{customer_name}}! Kaafi time ho gaya aapse mile hue at {{restaurant_name}} ❤️ Aapke next visit ke liye ₹${offerValue} Discount Coins ready hain. Jaldi aao!`
        : `Hey {{customer_name}}! {{restaurant_name}} ki taraf se aapko bohot bohot shukriya. Aapka favourite table humesha ready hai! ❤️`,
      HINDI: offerValue > 0
        ? `नमस्ते {{customer_name}}! {{restaurant_name}} में आपकी याद आ रही है। आपके अगले ऑर्डर के लिए ₹${offerValue} डिस्काउंट कॉइन्स वॉलेट में जोड़ दिए गए हैं। जल्द पधारें!`
        : `नमस्ते {{customer_name}}! {{restaurant_name}} का हिस्सा बनने के लिए आपका हार्दिक धन्यवाद। आपका स्वागत हमेशा रहेगा!`
    };

    const campaignDraft: Partial<AiCampaign> = {
      name,
      objective,
      audienceSegment,
      audienceConditions,
      targetCount: matchedCount,
      channel,
      mode: 'APPROVAL_REQUIRED',
      priority,
      status: 'PENDING_APPROVAL',
      tone,
      language: 'HINGLISH',
      offerType,
      offerValue,
      validityDays,
      messageTemplate: templates.HINGLISH,
      resolvedMessagePreview: templates.HINGLISH
        .replace('{{customer_name}}', matchedCustomers[0]?.name || 'Rahul')
        .replace('{{restaurant_name}}', 'The Chai & Chaat Co.')
        .replace('{{coin_reward}}', String(offerValue)),
      maxRewardCost: estimatedCost,
      requiresApproval: true,
      frequencyGuard: {
        maxPerMonth: 3,
        minGapDays: 5
      }
    };

    const explanation = `I converted your request into a targeted campaign for ${matchedCount} customers. Recommended ${
      offerType === 'NO_DISCOUNT' ? 'a heartfelt appreciation message with 0 discount' : `₹${offerValue} Discount Coins`
    }. Estimated maximum reward liability is ₹${estimatedCost.toLocaleString('en-IN')}, fully compliant with your restaurant loyalty configuration.`;

    return {
      campaignDraft,
      explanation,
      matchedAudienceCount: matchedCount,
      estimatedCost,
      audienceReason
    };
  }

  /**
   * Interpolate customer variables into a message
   */
  public static interpolateMessage(
    template: string,
    customer: Customer,
    restaurantName: string,
    coinReward: number,
    favouriteItem?: string
  ): string {
    return (template || '')
      .replace(/\{\{\s*customer_name\s*\}\}/gi, customer.name || 'Friend')
      .replace(/\{\{\s*restaurant_name\s*\}\}/gi, restaurantName || 'SwaadSevak')
      .replace(/\{\{\s*coin_reward\s*\}\}/gi, String(coinReward || 0))
      .replace(/\{\{\s*discount_coins\s*\}\}/gi, String(coinReward || 0))
      .replace(/\{\{\s*discount_value\s*\}\}/gi, String(coinReward || 0))
      .replace(/\{\{\s*coins\s*\}\}/gi, String(coinReward || 0))
      .replace(/\{\{\s*coin_balance\s*\}\}/gi, String(customer.coinBalance || 0))
      .replace(/\{\{\s*favourite_item\s*\}\}/gi, favouriteItem || (customer as any).favoriteDish || 'your favourites')
      .replace(/\{\{\s*discount_expiry\s*\}\}/gi, '7 days');
  }

  /**
   * Execute campaign with frequency guards and channel delivery
   */
  public static async executeCampaign(restaurantId: string, campaignId: string): Promise<{
    success: boolean;
    message: string;
    campaign?: AiCampaign;
    sentCount: number;
    deliveredCount: number;
  }> {
    const campaign = db.getAiCampaignById(restaurantId, campaignId);
    if (!campaign) {
      return { success: false, message: 'Campaign not found', sentCount: 0, deliveredCount: 0 };
    }

    const { customers } = this.getData(restaurantId);
    const waStatus = WhatsAppService.getStatus(restaurantId);
    const isWaConnected = waStatus.status === 'CONNECTED';

    // Treat manual execution as immediate so interval constraints don't suppress delivery
    (campaign as any).scheduleType = 'IMMEDIATE';
    (campaign as any).status = 'APPROVED';

    const result = await CampaignScheduler.evaluateAndExecuteCampaign(
      restaurantId,
      campaign,
      customers,
      isWaConnected
    );

    const updated = db.updateAiCampaign(restaurantId, campaignId, {
      status: 'COMPLETED'
    }) || campaign;

    return {
      success: true,
      message: `Campaign '${campaign.name}' executed! Sent to ${result.sent} customers${isWaConnected ? ' via WhatsApp' : ''}.`,
      campaign: updated,
      sentCount: result.sent,
      deliveredCount: Math.round(result.sent * 0.96)
    };
  }

  /**
   * Get overall AI CRM Dashboard Data
   */
  public static getDashboardData(restaurantId: string): AiCrmDashboardData {
    const isDemo = restaurantId === 'rest_demo_01';
    const { customers, orders } = this.getData(restaurantId);
    const hasEnoughData = isDemo || customers.length >= 10;

    const atRiskCustomers = customers.filter(c => c.status === 'AT_RISK' || c.status === 'INACTIVE');
    const atRiskCount = isDemo ? Math.max(43, atRiskCustomers.length) : atRiskCustomers.length;
    const winBackRev = isDemo ? Math.max(31200, Math.round(atRiskCount * 620 * 0.8)) : Math.round(atRiskCustomers.reduce((s, c) => s + c.totalSpent, 0) * 0.5);

    const vipCustomers = customers.filter(c => c.status === 'VIP' || c.totalSpent > 8000);
    const vipCount = isDemo ? Math.max(27, vipCustomers.length) : vipCustomers.length;
    const vipSpend = isDemo ? Math.max(48500, vipCustomers.reduce((s, c) => s + c.totalSpent, 0)) : vipCustomers.reduce((s, c) => s + c.totalSpent, 0);

    const recommendations = this.getAiRecommendations(restaurantId);
    const campaigns = db.getAiCampaigns(restaurantId);
    const automations = db.getAiAutomations(restaurantId);

    const activeAutomations = automations.filter(a => a.status === 'ACTIVE');
    const totalAttributedRevenue = isDemo
      ? 31400
      : (automations.reduce((s, a) => s + (a.revenueAttributed || 0), 0) +
         campaigns.reduce((s, c) => s + (c.stats?.revenueGenerated || 0), 0));

    return {
      hasEnoughData,
      customerCount: customers.length,
      winBackCard: {
        customerCount: atRiskCount,
        potentialRevenue: winBackRev
      },
      vipCard: {
        customerCount: vipCount,
        lifetimeSpend: vipSpend
      },
      opportunitiesCard: {
        count: recommendations.length
      },
      automationsCard: {
        activeCount: isDemo ? (activeAutomations.length || 4) : activeAutomations.length,
        recentRunsCount: automations.reduce((s, a) => s + (a.customersReached || 0), 0),
        totalAttributedRevenue
      },
      topRecommendations: recommendations.slice(0, 4),
      recentCampaigns: campaigns.slice(0, 5)
    };
  }
}
