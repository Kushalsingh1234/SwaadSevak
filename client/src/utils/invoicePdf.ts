import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Order, Restaurant, Bill } from '../types';

/**
 * Generates an ultra-crisp, mobile-optimized portrait digital tax invoice / order receipt.
 * Uses strict zero-vertical-padding line-height centering and table-cell vertical alignment
 * to completely eliminate html2canvas baseline downward shifts.
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

  // Build off-screen receipt DOM element
  const container = document.createElement('div');
  container.id = 'swaad-invoice-container';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';
  container.style.width = '420px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '24px 22px 20px 22px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.color = '#0f172a';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.45';

  container.innerHTML = `
    <!-- Top Heading Badge: Strict zero vertical padding + line-height centering prevents html2canvas downward baseline shift -->
    <div style="text-align: center; margin-bottom: 12px;">
      <span style="display: inline-block; height: 28px; line-height: 28px; padding: 0 16px; background-color: #ea580c; color: #ffffff; font-size: 11.5px; font-weight: 800; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.08em; box-sizing: border-box; vertical-align: middle;">
        ${headingText}
      </span>
    </div>

    <!-- Restaurant Header -->
    <div style="text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 14px; margin-bottom: 14px;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em; line-height: 28px;">
        ${restaurant?.name || 'Swaad Sevak Restaurant'}
      </h1>
      <p style="margin: 5px 0 0 0; font-size: 11.5px; color: #475569; line-height: 16px;">
        ${restaurant?.address ? `${restaurant.address}, ` : ''}${restaurant?.city || ''}${restaurant?.state ? `, ${restaurant.state}` : ''}
      </p>
      ${
        restaurant?.phone || restaurant?.email
          ? `<p style="margin: 3px 0 0 0; font-size: 11px; color: #64748b; line-height: 15px;">Ph: ${restaurant?.phone || ''} ${restaurant?.email ? `• ${restaurant.email}` : ''}</p>`
          : ''
      }
      ${
        hasGst
          ? `<p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 700; color: #ea580c; line-height: 15px;">GSTIN: ${restaurant?.gstNumber}</p>`
          : ''
      }
    </div>

    <!-- Table & Meta Details Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; box-sizing: border-box;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 4px;">
        <tr>
          <td style="vertical-align: middle; text-align: left;">
            <span style="display: inline-block; height: 26px; line-height: 26px; padding: 0 12px; background-color: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; border-radius: 6px; font-weight: 800; font-size: 12.5px; box-sizing: border-box; vertical-align: middle;">
              ${order.tableNumber || 'Dine-In'}
            </span>
          </td>
          <td style="vertical-align: middle; text-align: right;">
            <span style="font-weight: 800; color: #1e293b; font-size: 12.5px;">
              ${invoiceNumber}
            </span>
          </td>
        </tr>
      </table>
      <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 10.5px; line-height: 15px; padding-top: 2px;">
        <span>Order ID: <b style="color: #334155;">${order.orderNumber}</b></span>
        <span>${orderDate} • ${orderTime}</span>
      </div>
    </div>

    <!-- Items List Table -->
    <div style="border-bottom: 2px dashed #cbd5e1; padding-bottom: 10px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 6px; border-bottom: 1.5px solid #e2e8f0;">
        <span style="flex: 1;">Item Description</span>
        <span style="width: 44px; text-align: center;">Qty</span>
        <span style="width: 58px; text-align: right;">Rate</span>
        <span style="width: 68px; text-align: right;">Total</span>
      </div>

      ${order.items
        .map(
          item => `
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 11.5px; padding: 7px 0; border-bottom: 1px dotted #e2e8f0;">
          <div style="flex: 1; padding-right: 8px;">
            <span style="font-weight: 700; color: #0f172a; line-height: 16px;">${item.name}</span>
            ${item.portion ? `<span style="font-size: 9.5px; color: #64748b; display: block; line-height: 13px;">${item.portion}</span>` : ''}
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
    <div style="padding-bottom: 8px; margin-bottom: 12px; font-size: 11.5px;">
      <div style="display: flex; justify-content: space-between; color: #334155; padding: 2px 0;">
        <span>Item Subtotal</span>
        <span style="font-weight: 700;">₹${subtotal.toFixed(2)}</span>
      </div>
      ${
        hasGst
          ? `
        <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 10.5px; padding: 2px 0;">
          <span>CGST (2.5%)</span>
          <span>₹${cgst.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 10.5px; padding: 2px 0;">
          <span>SGST (2.5%)</span>
          <span>₹${sgst.toFixed(2)}</span>
        </div>
      `
          : ''
      }

      <!-- Grand Total Box: Table with vertical-align: middle guarantees true vertical centering in html2canvas -->
      <table style="width: 100%; border-collapse: collapse; background-color: #0f172a; border-radius: 8px; margin-top: 10px; box-sizing: border-box;">
        <tr>
          <td style="padding: 12px 16px; vertical-align: middle; text-align: left;">
            <span style="font-weight: 800; font-size: 12.5px; letter-spacing: 0.05em; text-transform: uppercase; color: #ffffff; line-height: 1;">
              Grand Total
            </span>
          </td>
          <td style="padding: 12px 16px; vertical-align: middle; text-align: right;">
            <span style="font-size: 18px; font-weight: 900; color: #fb923c; line-height: 1;">
              ₹${grandTotal.toFixed(2)}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Payment Settled Badge: Table-cell vertical centering -->
    <table style="width: 100%; border-collapse: collapse; background-color: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 8px; margin-bottom: 14px; box-sizing: border-box;">
      <tr>
        <td style="padding: 10px 14px; vertical-align: middle; text-align: center;">
          <div style="font-size: 11.5px; font-weight: 800; color: #047857; letter-spacing: 0.02em; line-height: 16px;">
            ✓ ${paymentMode} — SETTLED
          </div>
          <div style="font-size: 9.5px; color: #059669; line-height: 13px; margin-top: 2px;">
            Payment verified & recorded electronically
          </div>
        </td>
      </tr>
    </table>

    <!-- Verification Footer -->
    <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; line-height: 14px;">
      <p style="margin: 0; font-weight: 600; color: #64748b;">Thank you for dining with us! Please visit again.</p>
      <p style="margin: 3px 0 0 0; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #cbd5e1;">
        Computer Generated ${hasGst ? 'Tax Invoice' : 'Order Receipt'} • Powered by Swaad Sevak
      </p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Wait for DOM layout
    await new Promise(resolve => setTimeout(resolve, 60));

    const exactWidth = container.offsetWidth || 420;
    const exactHeight = container.scrollHeight;

    // Render container to high-res canvas with STRICT width and height
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

    const pdfWidthMm = 90;
    const pdfHeightMm = (exactHeight * pdfWidthMm) / exactWidth;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidthMm, pdfHeightMm]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');

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
