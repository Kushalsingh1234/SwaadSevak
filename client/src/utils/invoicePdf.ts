import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Order, Restaurant, Bill } from '../types';

/**
 * Generates an authentic, executive restaurant dining invoice / receipt.
 * Redesigned with clean typographic hierarchy and classic receipt dividers,
 * completely eliminating colored container boxes so text never sticks to bottom edges.
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
  container.style.width = '400px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '24px 22px 20px 22px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.color = '#0f172a';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.45';

  container.innerHTML = `
    <!-- Document Title -->
    <div style="text-align: center; margin-bottom: 6px;">
      <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #ea580c;">
        • ${headingText} •
      </span>
    </div>

    <!-- Restaurant Header -->
    <div style="text-align: center;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em; line-height: 28px; text-transform: uppercase;">
        ${restaurant?.name || 'Swaad Sevak Restaurant'}
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 11.5px; color: #475569; line-height: 16px;">
        ${restaurant?.address ? `${restaurant.address}, ` : ''}${restaurant?.city || ''}${restaurant?.state ? `, ${restaurant.state}` : ''}
      </p>
      ${
        restaurant?.phone || restaurant?.email
          ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b; line-height: 15px;">Ph: ${restaurant?.phone || ''} ${restaurant?.email ? `• ${restaurant.email}` : ''}</p>`
          : ''
      }
      ${
        hasGst
          ? `<p style="margin: 3px 0 0 0; font-size: 11px; font-weight: 700; color: #0f172a; line-height: 15px;">GSTIN: ${restaurant?.gstNumber}</p>`
          : ''
      }
    </div>

    <!-- Classic Double Rule Separator -->
    <div style="border-top: 1.5px solid #0f172a; border-bottom: 0.5px solid #0f172a; height: 3px; margin: 12px 0 14px 0;"></div>

    <!-- Table & Order Meta Info -->
    <div style="font-size: 11.5px; line-height: 18px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #cbd5e1;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-size: 13px; font-weight: 800; color: #0f172a;">
          Table: <span style="color: #ea580c;">${order.tableNumber || 'Dine-In'}</span>
        </span>
        <span style="font-weight: 800; color: #0f172a; font-size: 12px;">
          ${invoiceNumber}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 10.5px; padding-top: 2px;">
        <span>Order ID: <b style="color: #334155;">${order.orderNumber}</b></span>
        <span>${orderDate} • ${orderTime}</span>
      </div>
    </div>

    <!-- Itemized List Table -->
    <div style="margin-bottom: 12px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
        <thead>
          <tr style="border-bottom: 1.5px solid #0f172a; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #475569;">
            <th style="text-align: left; padding-bottom: 6px;">Item Description</th>
            <th style="text-align: center; width: 44px; padding-bottom: 6px;">Qty</th>
            <th style="text-align: right; width: 55px; padding-bottom: 6px;">Rate</th>
            <th style="text-align: right; width: 65px; padding-bottom: 6px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              item => `
            <tr style="border-bottom: 1px dotted #e2e8f0;">
              <td style="padding: 7px 0; text-align: left; vertical-align: top;">
                <div style="font-weight: 700; color: #0f172a; line-height: 15px;">${item.name}</div>
                ${item.portion ? `<div style="font-size: 9.5px; color: #64748b; line-height: 13px; margin-top: 1px;">${item.portion}</div>` : ''}
              </td>
              <td style="padding: 7px 0; text-align: center; color: #334155; font-weight: 600; vertical-align: top;">x${item.quantity}</td>
              <td style="padding: 7px 0; text-align: right; color: #64748b; vertical-align: top;">₹${item.price}</td>
              <td style="padding: 7px 0; text-align: right; font-weight: 800; color: #0f172a; vertical-align: top;">₹${item.price * item.quantity}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <!-- Summary & Grand Total -->
    <div style="font-size: 11.5px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; padding: 2px 0; color: #475569;">
        <span>Item Subtotal</span>
        <span style="font-weight: 700; color: #0f172a;">₹${subtotal.toFixed(2)}</span>
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

      <!-- Classic Grand Total Section with Clean Top/Bottom Rules -->
      <div style="border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; padding: 8px 0; margin-top: 8px; display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-size: 13px; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase; color: #0f172a;">
          Grand Total
        </span>
        <span style="font-size: 21px; font-weight: 900; color: #0f172a;">
          ₹${grandTotal.toFixed(2)}
        </span>
      </div>
    </div>

    <!-- Payment Settled Notice -->
    <div style="text-align: center; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; padding: 8px 0; margin-bottom: 14px;">
      <p style="margin: 0; font-size: 12px; font-weight: 800; color: #047857; letter-spacing: 0.03em; line-height: 16px;">
        ✓ ${paymentMode} — SETTLED
      </p>
      <p style="margin: 2px 0 0 0; font-size: 9.5px; color: #059669; line-height: 13px;">
        Electronic Payment Recorded • Swaad Sevak POS
      </p>
    </div>

    <!-- Verification Footer -->
    <div style="text-align: center; font-size: 10px; color: #64748b; line-height: 14px;">
      <p style="margin: 0; font-weight: 700; color: #334155;">Thank you for dining with us! Please visit again.</p>
      <p style="margin: 3px 0 0 0; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8;">
        Computer Generated ${hasGst ? 'Tax Invoice' : 'Order Receipt'} • Powered by Swaad Sevak
      </p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Wait for DOM layout
    await new Promise(resolve => setTimeout(resolve, 60));

    const exactWidth = container.offsetWidth || 400;
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
