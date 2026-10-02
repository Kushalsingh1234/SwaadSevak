import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Order, Restaurant, Bill } from '../types';

/**
 * Generates an ultra-crisp, mobile-optimized portrait digital tax invoice.
 * Perfectly sized for smartphone screens without empty whitespace or overflowing fonts.
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
  const cgst = Math.round(subtotal * 0.025 * 100) / 100;
  const sgst = Math.round(subtotal * 0.025 * 100) / 100;
  const grandTotal = Math.round(subtotal + cgst + sgst);
  const paymentMode = bill?.paymentStatus
    ? bill.paymentStatus.replace('PAID_', 'PAID VIA ')
    : 'PAID VIA UPI';

  // 1. Build an off-screen mobile-optimized receipt DOM element
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '390px'; // standard smartphone viewport width
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '24px 20px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  container.style.color = '#0f172a';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.4';

  container.innerHTML = `
    <div style="text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 14px;">
      <div style="display: inline-block; background-color: #ea580c; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">
        Tax Invoice • Cash Memo
      </div>
      <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em;">
        ${restaurant?.name || 'Swaad Sevak Restaurant'}
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">
        ${restaurant?.address ? `${restaurant.address}, ` : ''}${restaurant?.city || ''}
      </p>
      ${
        restaurant?.phone || restaurant?.email
          ? `<p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Ph: ${restaurant?.phone || ''} ${restaurant?.email ? `• ${restaurant.email}` : ''}</p>`
          : ''
      }
      ${
        restaurant?.gstNumber
          ? `<p style="margin: 3px 0 0 0; font-size: 10px; font-weight: 700; color: #ea580c;">GSTIN: ${restaurant.gstNumber}</p>`
          : ''
      }
    </div>

    <!-- Table & Meta Details -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; margin-bottom: 16px; font-size: 11px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 800; font-size: 13px; color: #ea580c; background-color: #fff7ed; padding: 2px 8px; border-radius: 6px; border: 1px solid #ffedd5;">
          ${order.tableNumber}
        </span>
        <span style="font-weight: 700; color: #334155;">
          ${invoiceNumber}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 10px;">
        <span>Order ID: <b>${order.orderNumber}</b></span>
        <span>${orderDate} • ${orderTime}</span>
      </div>
    </div>

    <!-- Items List -->
    <div style="border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;">
        <span style="flex: 1;">Item Description</span>
        <span style="width: 40px; text-align: center;">Qty</span>
        <span style="width: 50px; text-align: right;">Rate</span>
        <span style="width: 60px; text-align: right;">Total</span>
      </div>

      ${order.items
        .map(
          item => `
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 11px; padding: 7px 0; border-bottom: 1px dotted #f1f5f9;">
          <div style="flex: 1; padding-right: 8px;">
            <span style="font-weight: 700; color: #0f172a;">${item.name}</span>
            ${item.portion ? `<span style="font-size: 9px; color: #64748b; display: block;">${item.portion}</span>` : ''}
          </div>
          <span style="width: 40px; text-align: center; font-weight: 600; color: #475569;">x${item.quantity}</span>
          <span style="width: 50px; text-align: right; color: #64748b;">₹${item.price}</span>
          <span style="width: 60px; text-align: right; font-weight: 700; color: #0f172a;">₹${item.price * item.quantity}</span>
        </div>
      `
        )
        .join('')}
    </div>

    <!-- Calculation Breakdown -->
    <div style="padding-bottom: 12px; margin-bottom: 14px; font-size: 11px;">
      <div style="display: flex; justify-content: space-between; color: #475569; padding: 2px 0;">
        <span>Item Subtotal</span>
        <span style="font-weight: 600;">₹${subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 10px; padding: 2px 0;">
        <span>CGST (2.5%)</span>
        <span>₹${cgst.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 10px; padding: 2px 0;">
        <span>SGST (2.5%)</span>
        <span>₹${sgst.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; background-color: #0f172a; color: #ffffff; padding: 10px 14px; border-radius: 10px; margin-top: 8px;">
        <span style="font-weight: 800; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Grand Total</span>
        <span style="font-size: 16px; font-weight: 900; color: #fb923c;">₹${grandTotal.toFixed(2)}</span>
      </div>
    </div>

    <!-- Payment Settled Badge -->
    <div style="background-color: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 10px; padding: 9px; text-align: center; margin-bottom: 16px;">
      <p style="margin: 0; font-size: 11px; font-weight: 800; color: #047857; letter-spacing: 0.02em;">
        ✓ ${paymentMode} — SETTLED
      </p>
      <p style="margin: 2px 0 0 0; font-size: 9px; color: #059669;">
        Payment verified & recorded electronically
      </p>
    </div>

    <!-- Verification Footer -->
    <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px; font-size: 10px; color: #94a3b8;">
      <p style="margin: 0; font-weight: 600; color: #64748b;">Thank you for dining with us! Please visit again.</p>
      <p style="margin: 3px 0 0 0; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #cbd5e1;">
        Computer Generated Tax Invoice • Powered by Swaad Sevak
      </p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // 2. Render container to high-res canvas (scale: 2 for crisp 300dpi retina text)
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');

    // 3. Convert pixel dimensions to mm for PDF (portrait format)
    const imgWidthMm = 80; // Standard 80mm portrait mobile receipt width
    const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

    // 4. Initialize jsPDF with EXACT computed dimensions so there is ZERO wasted empty space!
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [imgWidthMm, imgHeightMm]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, imgHeightMm);

    // 5. Save PDF directly to user's phone / device
    const safeFilename = `Invoice-${invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    pdf.save(safeFilename);
  } catch (error) {
    console.error('Failed to generate canvas invoice PDF, falling back to pure PDF:', error);
    // Fallback in case canvas fails
    fallbackPurePdf(order, invoiceNumber, orderDate, orderTime, subtotal, cgst, sgst, grandTotal, paymentMode, restaurant);
  } finally {
    document.body.removeChild(container);
  }
}

function fallbackPurePdf(
  order: Order,
  invoiceNumber: string,
  orderDate: string,
  orderTime: string,
  subtotal: number,
  cgst: number,
  sgst: number,
  grandTotal: number,
  paymentMode: string,
  restaurant: Restaurant | null
) {
  // Mobile portrait dimensions: 80mm width, dynamic height
  const itemRowHeight = 6;
  const baseHeight = 110;
  const totalHeight = baseHeight + (order.items.length * itemRowHeight);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, totalHeight]
  });

  const margin = 5;
  const width = 70;
  let y = 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(234, 88, 12);
  doc.text(restaurant?.name || 'Swaad Sevak Restaurant', 40, y, { align: 'center' });

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(restaurant?.address || 'Restaurant Address', 40, y, { align: 'center' });

  y += 4;
  doc.text(`GSTIN: ${restaurant?.gstNumber || 'URP'}`, 40, y, { align: 'center' });

  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, margin + width, y);

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${order.tableNumber}`, margin, y);
  doc.text(invoiceNumber, margin + width, y, { align: 'right' });

  y += 3.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Order: ${order.orderNumber}`, margin, y);
  doc.text(`${orderDate} ${orderTime}`, margin + width, y, { align: 'right' });

  y += 4;
  doc.line(margin, y, margin + width, y);

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('Item', margin, y);
  doc.text('Qty', margin + 40, y);
  doc.text('Amount (Rs)', margin + width, y, { align: 'right' });

  y += 2;
  doc.line(margin, y, margin + width, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  for (const item of order.items) {
    doc.text(item.name.slice(0, 22), margin, y);
    doc.text(`x${item.quantity}`, margin + 40, y);
    doc.text(`Rs.${item.price * item.quantity}`, margin + width, y, { align: 'right' });
    y += itemRowHeight;
  }

  doc.line(margin, y, margin + width, y);
  y += 4;

  doc.text('Subtotal:', margin + 30, y);
  doc.text(`Rs.${subtotal.toFixed(2)}`, margin + width, y, { align: 'right' });
  y += 3.5;

  doc.text('GST (5%):', margin + 30, y);
  doc.text(`Rs.${(cgst + sgst).toFixed(2)}`, margin + width, y, { align: 'right' });
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(234, 88, 12);
  doc.text('Grand Total:', margin + 30, y);
  doc.text(`Rs.${grandTotal.toFixed(2)}`, margin + width, y, { align: 'right' });
  y += 6;

  doc.setFontSize(7.5);
  doc.setTextColor(5, 150, 105);
  doc.text(`[ ${paymentMode} ]`, 40, y, { align: 'center' });

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('Powered by Swaad Sevak Restaurant OS', 40, y, { align: 'center' });

  doc.save(`Invoice-${invoiceNumber}.pdf`);
}
