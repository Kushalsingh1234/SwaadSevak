import { Order, Restaurant, KOTData, PrinterConfig } from '../types/index.js';

export class PrinterService {
  /**
   * Generates structured KOT payload for an order
   */
  static generateKotData(restaurant: Restaurant, order: Order, printerConfig: PrinterConfig): KOTData {
    const timeFormatted = new Date(order.createdAt).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      restaurantName: restaurant.name,
      kotNumber: order.kotNumber || 'KOT-1001',
      orderNumber: order.orderNumber,
      tableNumber: order.tableNumber,
      time: timeFormatted,
      source: order.source,
      items: order.items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        portion: i.portion,
        notes: i.notes
      })),
      specialInstructions: order.customerNotes,
      paperWidth: printerConfig.paperWidth
    };
  }

  /**
   * Generates clean ESC/POS text representation (standard for 58mm/80mm thermal printers)
   */
  static generateThermalText(kot: KOTData): string {
    const is80mm = kot.paperWidth === '80mm';
    const width = is80mm ? 42 : 32;
    const divider = '-'.repeat(width);
    const doubleDivider = '='.repeat(width);

    const center = (str: string) => {
      const pad = Math.max(0, Math.floor((width - str.length) / 2));
      return ' '.repeat(pad) + str;
    };

    let receipt = '';
    receipt += `${doubleDivider}\n`;
    receipt += `${center(kot.restaurantName.toUpperCase())}\n`;
    receipt += `${center('*** KITCHEN ORDER TICKET ***')}\n`;
    receipt += `${center(`${kot.kotNumber}  |  ORD ${kot.orderNumber}`)}\n`;
    receipt += `${doubleDivider}\n`;
    receipt += `TABLE: ${kot.tableNumber.padEnd(16)} TIME: ${kot.time}\n`;
    receipt += `SOURCE: ${kot.source}\n`;
    receipt += `${divider}\n`;
    receipt += `QTY   ITEM DESCRIPTION\n`;
    receipt += `${divider}\n`;

    for (const item of kot.items) {
      const qtyStr = `${item.quantity} x `.padEnd(6);
      const name = item.name + (item.portion ? ` (${item.portion})` : '');
      receipt += `${qtyStr}${name}\n`;
      if (item.notes) {
        receipt += `      * Note: ${item.notes}\n`;
      }
    }

    if (kot.specialInstructions) {
      receipt += `${divider}\n`;
      receipt += `INSTRUCTIONS:\n${kot.specialInstructions}\n`;
    }

    receipt += `${doubleDivider}\n`;
    receipt += `${center('POWERED BY SWAAD SEVAK')}\n\n\n`;

    return receipt;
  }
}
