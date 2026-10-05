import { SITE_CONTENT } from '../content/site';

export interface FormSubmissionPayload {
  formType: 'demo_booking' | 'website_24h_order';
  restaurantName: string;
  ownerName: string;
  whatsappNumber: string;
  city: string;
  outletTypeOrCuisine?: string;
  selectedColor?: string;
  interest?: string;
  planId?: string;
  menuFileName?: string;
  honeypot?: string; // Anti-spam trap
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  whatsappUrl?: string;
}

/**
 * Builds a direct WhatsApp pre-filled chat link with formatted restaurant details
 */
export function buildWhatsAppLink(payload: FormSubmissionPayload): string {
  const number = SITE_CONTENT.brand.whatsappNumber;
  
  let text = `*Namaste SwaadSevak Team!*\n\n`;
  if (payload.formType === 'website_24h_order') {
    text += `I would like to get our restaurant website created in *24 Hours*.\n\n`;
  } else {
    text += `I would like to book a *Free 10-Minute SwaadSevak POS Demo*.\n\n`;
  }

  text += `🍽️ *Restaurant:* ${payload.restaurantName}\n`;
  text += `👤 *Contact Name:* ${payload.ownerName}\n`;
  text += `📱 *Phone:* ${payload.whatsappNumber}\n`;
  text += `📍 *City:* ${payload.city}\n`;

  if (payload.outletTypeOrCuisine) {
    text += `🍲 *Category/Cuisine:* ${payload.outletTypeOrCuisine}\n`;
  }
  if (payload.selectedColor) {
    text += `🎨 *Brand Theme:* ${payload.selectedColor}\n`;
  }
  if (payload.planId) {
    text += `💼 *Selected Plan:* ${payload.planId}\n`;
  }
  if (payload.interest) {
    text += `🎯 *Looking for:* ${payload.interest}\n`;
  }
  if (payload.menuFileName) {
    text += `📎 *Menu Attached:* ${payload.menuFileName}\n`;
  }

  text += `\nPlease connect with me regarding next steps.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Submits form data to the remote endpoint if configured, or falls back to WhatsApp
 */
export async function submitLeadForm(payload: FormSubmissionPayload): Promise<SubmissionResult> {
  // 1. Check Honeypot spam field
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    console.warn('[Form Spam Rejected] Honeypot field triggered.');
    return {
      success: true,
      message: 'Submission received.',
    };
  }

  // 2. Read endpoint from env
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
  const whatsappFallbackUrl = buildWhatsAppLink(payload);

  // TODO: [PRE-LAUNCH CHECKLIST] Connect your CRM, Google Sheets Webhook, or Node.js backend endpoint in .env (VITE_FORM_ENDPOINT)
  if (endpoint && endpoint.trim().length > 0 && endpoint.startsWith('http')) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          submittedAt: new Date().toISOString(),
          source: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Thank you! Our restaurant onboarding specialist will contact you within 15 minutes.',
        whatsappUrl: whatsappFallbackUrl,
      };
    } catch (err) {
      console.warn('[Form Endpoint Failed — Defaulting to WhatsApp fallback]', err);
    }
  }

  // 3. Fallback: Always succeed gracefully and provide direct WhatsApp link
  return {
    success: true,
    message: 'Details captured! Click below to confirm directly via WhatsApp with our team.',
    whatsappUrl: whatsappFallbackUrl,
  };
}
