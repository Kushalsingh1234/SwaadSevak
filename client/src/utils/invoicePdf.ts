import { jsPDF } from 'jspdf';
import { Order, Restaurant, Bill } from '../types';

export function downloadInvoicePdf(order: Order, bill: Bill | null, restaurant: Restaurant | null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = 20;

  // Header - Restaurant Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(234, 88, 12); // #ea580c (Swaad Orange)
  doc.text(restaurant?.name || 'Swaad Sevak Restaurant', margin, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // Slate 600
  if (restaurant?.address) {
    doc.text(`${restaurant.address}, ${restaurant.city || ''} ${restaurant.state || ''}`, margin, y);
    y += 5;
  }
  if (restaurant?.phone || restaurant?.email) {
    doc.text(`Phone: ${restaurant?.phone || 'N/A'} | Email: ${restaurant?.email || 'N/A'}`, margin, y);
    y += 5;
  }
  if (restaurant?.gstNumber) {
    doc.setFont('helvetica', 'bold');
    doc.text(`GSTIN: ${restaurant.gstNumber}`, margin, y);
    doc.setFont('helvetica', 'normal');
    y += 5;
  }

  y += 4;
  // Divider
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  // Title Box
  const invoiceNum = bill?.billNumber || `INV-${order.orderNumber.replace('#', '')}`;
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

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('TAX INVOICE / CASH MEMO', margin, y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Original for Recipient`, margin + contentWidth, y, { align: 'right' });

  y += 7;
  // Metadata grid
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Invoice No: ${invoiceNum}`, margin, y);
  doc.text(`Date: ${orderDate} at ${orderTime}`, margin + contentWidth, y, { align: 'right' });

  y += 5;
  doc.text(`Table: ${order.tableNumber}`, margin, y);
  doc.text(`Order ID: ${order.orderNumber}`, margin + contentWidth, y, { align: 'right' });

  y += 8;

  // Items Table Header
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('S.No', margin + 3, y + 5.5);
  doc.text('Item Description', margin + 18, y + 5.5);
  doc.text('Qty', margin + 110, y + 5.5, { align: 'center' });
  doc.text('Rate', margin + 135, y + 5.5, { align: 'right' });
  doc.text('Amount (INR)', margin + contentWidth - 4, y + 5.5, { align: 'right' });

  y += 8;

  // Items Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  order.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    const isEven = index % 2 === 0;

    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 8, 'S');

    doc.setTextColor(71, 85, 105);
    doc.text(`${index + 1}`, margin + 3, y + 5.5);

    doc.setTextColor(15, 23, 42);
    const itemName = item.portion ? `${item.name} (${item.portion})` : item.name;
    doc.text(itemName, margin + 18, y + 5.5);

    doc.setTextColor(71, 85, 105);
    doc.text(`${item.quantity}`, margin + 110, y + 5.5, { align: 'center' });
    doc.text(`₹${item.price.toFixed(2)}`, margin + 135, y + 5.5, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`₹${itemTotal.toFixed(2)}`, margin + contentWidth - 4, y + 5.5, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += 8;
  });

  y += 4;

  // Totals Section
  const subtotal = order.subtotal || order.items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const cgst = Math.round((subtotal * 0.025) * 100) / 100;
  const sgst = Math.round((subtotal * 0.025) * 100) / 100;
  const grandTotal = Math.round(subtotal + cgst + sgst);

  const totalsX = margin + 110;
  const totalsValX = margin + contentWidth - 4;

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', totalsX, y);
  doc.text(`₹${subtotal.toFixed(2)}`, totalsValX, y, { align: 'right' });
  y += 5.5;

  doc.text('CGST (2.5%):', totalsX, y);
  doc.text(`₹${cgst.toFixed(2)}`, totalsValX, y, { align: 'right' });
  y += 5.5;

  doc.text('SGST (2.5%):', totalsX, y);
  doc.text(`₹${sgst.toFixed(2)}`, totalsValX, y, { align: 'right' });
  y += 6;

  // Grand Total Box
  doc.setFillColor(255, 247, 237); // Orange 50
  doc.setDrawColor(254, 215, 170); // Orange 200
  doc.rect(totalsX - 6, y - 2, (pageWidth - margin) - totalsX + 6, 10, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(234, 88, 12); // Orange 600
  doc.text('Grand Total:', totalsX, y + 4.5);
  doc.text(`₹${grandTotal.toFixed(2)}`, totalsValX, y + 4.5, { align: 'right' });

  y += 18;

  // Payment Status Banner
  const paymentMode = bill?.paymentStatus
    ? bill.paymentStatus.replace('PAID_', 'PAID VIA ')
    : 'PAID VIA UPI';

  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.setDrawColor(167, 243, 208); // Emerald 200
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text(`✓ ${paymentMode} - PAYMENT RECEIVED & SETTLED`, margin + (contentWidth / 2), y + 7.5, { align: 'center' });

  y += 24;

  // Footer notes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('Thank you for dining with us! Please visit again.', margin + (contentWidth / 2), y, { align: 'center' });
  y += 4.5;
  doc.text('Digitally generated GST Invoice • Powered by Swaad Sevak Restaurant OS', margin + (contentWidth / 2), y, { align: 'center' });

  // Download Trigger
  const safeFilename = `Invoice-${invoiceNum.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(safeFilename);
}
