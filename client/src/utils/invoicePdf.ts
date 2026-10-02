import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Order, Restaurant, Bill } from '../types';

/**
 * Generates an ultra-crisp, mobile-optimized portrait digital tax invoice / order receipt.
 * Perfectly sized for smartphone screens without empty whitespace, clipped text, or awkward padding.
 */
export async function downloadInvoicePdf(
  order: Order,
  bill: Bill | null,
  restaurant: Restaurant | null
): Promise<void> {
  const invoiceNumber = bill?.billNumber || `INV-${order.orderNumber.replace('#', '')}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const subtotal = order.subtotal || order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const hasGst = Boolean(restaurant?.gstNumber && restaurant.gstNumber.trim().length > 0);
  const cgst = hasGst ? Math.round(subtotal * 0.025 * 100) / 100 : 0;
  const sgst = hasGst ? Math.round(subtotal * 0.025 * 100) / 100 : 0;
  const grandTotal = Math.round(subtotal + cgst + sgst);
  const paymentMode = bill?.paymentStatus
    ? bill.paymentStatus.replace('PAID_', 'PAID VIA ')
    : 'PAID VIA UPI';

  const headingText = hasGst ? 'TAX INVOICE' : 'ORDER RECEIPT';
  const subtitleBadgeText = hasGst ? `GSTIN: ${restaurant?.gstNumber}` : 'ORDER RECEIPT';

  // 1. Build an off-screen mobile-optimized receipt DOM element
  const container = document.createElement('div');
  container.id = 'swaad-invoice-container';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';
  container.style.width = '420px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '26px 22px 22px 22px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.color = '#0f172a';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.5';

  container.innerHTML = `
    <!-- Top Invoice / Receipt Heading Badge -->
    <div style="text-align: center; margin-bottom: 14px;">
      <span style="display: inline-block; background-color: #ea580c; color: #ffffff; font-size: 12px; font-weight: 800; padding: 7px 18px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.08em; line-height: 16px; box-shadow: 0 1px 2px rgba(234, 88, 12, 0.2);">
        ${headingText}
      </span>
    </div>

    <!-- Restaurant Header -->
    <div style="text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 16px;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em; line-height: 28px;">
        ${restaurant?.name || 'Swaad Sevak Restaurant'}
      </h1>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #475569; line-height: 17px;">
        ${restaurant?.address ? `${restaurant.address}, ` : ''}${restaurant?.city || ''}${restaurant?.state ? `, ${restaurant.state}` : ''}
      </p>
      ${
        restaurant?.phone || restaurant?.email
          ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; line-height: 16px;">Ph: ${restaurant?.phone || ''} ${restaurant?.email ? `• ${restaurant.email}` : ''}</p>`
          : ''
      }
      <div style="margin-top: 8px;">
        <span style="display: inline-block; font-size: 11px; font-weight: 700; color: #ea580c; background-color: #fff7ed; padding: 5px 12px; border-radius: 6px; border: 1px solid #fed7aa; line-height: 15px;">
          ${subtitleBadgeText}
        </span>
      </div>
    </div>

    <!-- Table & Meta Details Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 800; font-size: 13px; color: #ea580c; background-color: #fff7ed; padding: 6px 14px; border-radius: 6px; border: 1px solid #fed7aa; line-height: 16px; display: inline-block;">
          ${order.tableNumber || 'Dine-In'}
        </span>
        <span style="font-weight: 800; color: #1e293b; font-size: 12.5px;">
          ${invoiceNumber}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 11px; line-height: 16px; padding-top: 2px;">
        <span>Order ID: <b style="color: #334155;">${order.orderNumber}</b></span>
        <span>${orderDate} • ${orderTime}</span>
      </div>
    </div>

    <!-- Items List Table -->
    <div style="border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 8px; border-bottom: 1.5px solid #e2e8f0;">
        <span style="flex: 1;">Item Description</span>
        <span style="width: 44px; text-align: center;">Qty</span>
        <span style="width: 58px; text-align: right;">Rate</span>
        <span style="width: 68px; text-align: right;">Total</span>
      </div>

      ${order.items
        .map(
          item => `
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; padding: 8px 0; border-bottom: 1px dotted #e2e8f0;">
          <div style="flex: 1; padding-right: 8px;">
            <span style="font-weight: 700; color: #0f172a; line-height: 17px;">${item.name}</span>
            ${item.portion ? `<span style="font-size: 10px; color: #64748b; display: block; line-height: 14px; margin-top: 1px;">${item.portion}</span>` : ''}
          </div>
          <span style="width: 44px; text-align: center; font-weight: 700; color: #334155;">x${item.quantity}</span>
          <span style="width: 58px; text-align: right; color: #64748b;">₹${item.price}</span>
          <span style="width: 68px; text-align: right; font-weight: 800; color: #0f172a;">₹${item.price * item.quantity}</span>
        </div>
      `
        )
        .join('')}
    </div>

    <!-- Calculation Breakdown -->
    <div style="padding-bottom: 10px; margin-bottom: 14px; font-size: 12px;">
      <div style="display: flex; justify-content: space-between; color: #334155; padding: 3px 0;">
        <span>Item Subtotal</span>
        <span style="font-weight: 700;">₹${subtotal.toFixed(2)}</span>
      </div>
      ${
        hasGst
          ? `
        <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 11px; padding: 2.5px 0;">
          <span>CGST (2.5%)</span>
          <span>₹${cgst.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 11px; padding: 2.5px 0;">
          <span>SGST (2.5%)</span>
          <span>₹${sgst.toFixed(2)}</span>
        </div>
      `
          : ''
      }

      <!-- Grand Total Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; background-color: #0f172a; color: #ffffff; padding: 14px 18px; border-radius: 10px; margin-top: 12px; box-sizing: border-box;">
        <span style="font-weight: 800; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: #ffffff; line-height: 16px;">
          Grand Total
        </span>
        <span style="font-size: 19px; font-weight: 900; color: #fb923c; line-height: 1;">
          ₹${grandTotal.toFixed(2)}
        </span>
      </div>
    </div>

    <!-- Payment Settled Badge -->
    <div style="background-color: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 10px; padding: 12px 16px; text-align: center; margin-bottom: 16px; box-sizing: border-box;">
      <p style="margin: 0; font-size: 12px; font-weight: 800; color: #047857; letter-spacing: 0.03em; line-height: 18px;">
        ✓ ${paymentMode} — SETTLED
      </p>
      <p style="margin: 3px 0 0 0; font-size: 10px; color: #059669; line-height: 14px;">
        Payment verified & recorded electronically
      </p>
    </div>

    <!-- Verification Footer -->
    <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 10.5px; color: #94a3b8; line-height: 15px;">
      <p style="margin: 0; font-weight: 600; color: #64748b;">Thank you for dining with us! Please visit again.</p>
      <p style="margin: 3px 0 0 0; font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: #cbd5e1;">
        Computer Generated Tax Invoice • Powered by Swaad Sevak
      </p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Wait for DOM layout
    await new Promise(resolve => setTimeout(resolve, 60));

    const exactWidth = container.offsetWidth || 420;
    const exactHeight = container.scrollHeight;

    // 2. Render container to high-res canvas with STRICT width and height
    const canvas = await html2canvas(container, {
      scale: 3, // 3x for ultra-sharp retina typography
      useCORS: true,
      backgroundColor: '#ffffff',
      width: exactWidth,
      height: exactHeight,
      windowWidth: exactWidth,
      windowHeight: exactHeight,
      x: 0,
      y: 0,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // 3. Convert pixel dimensions to mm for PDF:
    // We set 90mm width (standard mobile portrait receipt width).
    // The height is calculated STRICTLY from the exact content aspect ratio!
    const pdfWidthMm = 90;
    const pdfHeightMm = (exactHeight * pdfWidthMm) / exactWidth;

    // 4. Initialize jsPDF with EXACT computed dimensions so there is ZERO wasted empty space!
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidthMm, pdfHeightMm]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');

    // 5. Save PDF directly to user's phone / device
    const safeFilename = `Invoice-${invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    pdf.save(safeFilename);
  } catch (error) {
    console.error('Failed to generate canvas invoice PDF:', error);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
