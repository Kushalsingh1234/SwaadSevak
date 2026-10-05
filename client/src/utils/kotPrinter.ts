import { Order, Restaurant, PrinterConfig, OrderAddition } from '../types';
import { api } from '../services/api';

export interface UsbDeviceInfo {
  name: string;
  vendorId?: number;
  productId?: number;
}

export const getOrderDisplayTitle = (order?: { source?: any; tableNumber?: string } | null): string => {
  if (!order) return 'Order';
  if (order.source === 'SWIGGY' || order.tableNumber?.toLowerCase().includes('swiggy')) {
    return 'Swiggy Order';
  }
  if (order.source === 'ZOMATO' || order.tableNumber?.toLowerCase().includes('zomato')) {
    return 'Zomato Order';
  }
  if (order.source === 'OTHER' || order.tableNumber?.toLowerCase().includes('online')) {
    return 'Online Order';
  }
  if (!order.tableNumber) return 'Counter Order';
  return order.tableNumber.toLowerCase().startsWith('table') ? order.tableNumber : `Table ${order.tableNumber}`;
};

class KotPrinterManager {
  private activeUsbDevice: any = null;
  private usbDeviceName: string | null = null;

  constructor() {
    this.usbDeviceName = localStorage.getItem('swaad_usb_printer_name');
  }

  /**
   * Check if WebUSB API is supported by the browser
   */
  isWebUsbSupported(): boolean {
    return typeof navigator !== 'undefined' && 'usb' in navigator;
  }

  /**
   * Check if a USB printer is paired
   */
  getConnectedUsbDevice(): { isConnected: boolean; deviceName?: string } {
    return {
      isConnected: Boolean(this.activeUsbDevice || this.usbDeviceName),
      deviceName: this.activeUsbDevice?.productName || this.usbDeviceName || undefined
    };
  }

  /**
   * Direct in-app pairing for USB Thermal Receipt Printers (POS-58, POS-80, Epson, TVS, Xprinter, etc.)
   * No Wi-Fi or Bluetooth required!
   */
  async pairUsbPrinter(): Promise<{ success: boolean; deviceName?: string; error?: string }> {
    if (!this.isWebUsbSupported()) {
      return {
        success: false,
        error: 'WebUSB is not supported in this browser. Please use Google Chrome or Microsoft Edge.'
      };
    }

    try {
      // Request device from user with common printer interface class or any USB device
      const device = await (navigator as any).usb.requestDevice({
        filters: []
      });

      if (!device) {
        return { success: false, error: 'No printer selected.' };
      }

      await device.open();
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }

      this.activeUsbDevice = device;
      const deviceName = device.productName || 'USB Thermal Receipt Printer';
      this.usbDeviceName = deviceName;
      localStorage.setItem('swaad_usb_printer_name', deviceName);

      return { success: true, deviceName };
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        return { success: false, error: 'Pairing cancelled (no device selected).' };
      }
      return { success: false, error: err.message || 'Failed to connect USB printer.' };
    }
  }

  /**
   * Disconnect the USB printer
   */
  disconnectUsbPrinter(): void {
    if (this.activeUsbDevice) {
      try {
        this.activeUsbDevice.close();
      } catch {}
      this.activeUsbDevice = null;
    }
    this.usbDeviceName = null;
    localStorage.removeItem('swaad_usb_printer_name');
  }

  /**
   * Directly sends raw ESC/POS commands to connected WebUSB thermal printer
   */
  async printToUsbDevice(text: string): Promise<boolean> {
    if (!this.activeUsbDevice) return false;
    try {
      if (!this.activeUsbDevice.opened) {
        await this.activeUsbDevice.open();
      }
      if (this.activeUsbDevice.configuration === null) {
        await this.activeUsbDevice.selectConfiguration(1);
      }
      const conf = this.activeUsbDevice.configuration;
      const iface = conf?.interfaces?.find((i: any) =>
        i.alternates?.some((a: any) => a.endpoints?.some((e: any) => e.direction === 'out'))
      );
      if (iface) {
        await this.activeUsbDevice.claimInterface(iface.interfaceNumber);
        const endpoint = iface.alternates[0].endpoints.find((e: any) => e.direction === 'out');
        const encoder = new TextEncoder();
        const initCmd = new Uint8Array([0x1B, 0x40]); // ESC @ (initialize printer)
        const cutCmd = new Uint8Array([0x1D, 0x56, 0x41, 0x10]); // GS V A (cut paper)
        const bodyData = encoder.encode(text);
        const fullData = new Uint8Array(initCmd.length + bodyData.length + cutCmd.length);
        fullData.set(initCmd, 0);
        fullData.set(bodyData, initCmd.length);
        fullData.set(cutCmd, initCmd.length + bodyData.length);
        await this.activeUsbDevice.transferOut(endpoint.endpointNumber, fullData);
        return true;
      }
    } catch (err) {
      console.warn('[KotPrinter] WebUSB direct write error:', err);
    }
    return false;
  }

  /**
   * Generate clean text receipt representation for ESC/POS
   */
  generateEscPosText(
    restaurant: Restaurant | null,
    order: Order,
    paperWidth: '58mm' | '80mm' = '80mm',
    addition?: OrderAddition
  ): string {
    const is80mm = paperWidth === '80mm';
    const width = is80mm ? 42 : 32;
    const divider = '-'.repeat(width);
    const doubleDivider = '='.repeat(width);

    const center = (str: string) => {
      const pad = Math.max(0, Math.floor((width - str.length) / 2));
      return ' '.repeat(pad) + str;
    };

    const orderTime = new Date(addition?.createdAt || order.createdAt).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const isAddition = Boolean(addition);
    const items = addition ? addition.items : order.items;
    const notes = addition ? addition.customerNotes : order.customerNotes;

    const isOnline =
      order.source === 'SWIGGY' ||
      order.source === 'ZOMATO' ||
      order.source === 'OTHER' ||
      order.tableNumber?.toLowerCase().includes('swiggy') ||
      order.tableNumber?.toLowerCase().includes('zomato');

    const channelTitle =
      order.source === 'SWIGGY' || order.tableNumber?.toLowerCase().includes('swiggy')
        ? 'SWIGGY ORDER'
        : order.source === 'ZOMATO' || order.tableNumber?.toLowerCase().includes('zomato')
        ? 'ZOMATO ORDER'
        : order.source === 'OTHER' || order.tableNumber?.toLowerCase().includes('online')
        ? 'ONLINE ORDER'
        : order.tableNumber?.toLowerCase().startsWith('table')
        ? order.tableNumber.toUpperCase()
        : `TABLE: ${order.tableNumber || 'COUNTER'}`;

    let ticket = '';
    ticket += `${doubleDivider}\n`;
    ticket += `${center((restaurant?.name || 'SWAAD SEVAK').toUpperCase())}\n`;

    if (isAddition) {
      ticket += `${center('*** TABLE ADD-ON KOT ***')}\n`;
      ticket += `${center('>>> NEW ADDITION <<<')}\n`;
      ticket += `${center(`${addition?.additionNumber || 'ADD-ON'}  |  REF ORD #${order.orderNumber.replace('#', '')}`)}\n`;
    } else {
      ticket += `${center('*** KITCHEN ORDER TICKET ***')}\n`;
      ticket += `${center(`${order.kotNumber || 'KOT-1001'}  |  ORD #${order.orderNumber.replace('#', '')}`)}\n`;
    }

    ticket += `${doubleDivider}\n`;
    if (isOnline) {
      ticket += `CHANNEL: ${channelTitle.padEnd(16)} TIME: ${orderTime}\n`;
      ticket += `DELIVERY: ${order.source} ONLINE PARTNER\n`;
      if (order.estimatedPrepTime) {
        ticket += `TARGET PREP: ${order.estimatedPrepTime} MINS\n`;
      }
    } else {
      ticket += `TABLE: ${(order.tableNumber || 'Counter').padEnd(16)} TIME: ${orderTime}\n`;
      ticket += `SOURCE: ${order.source || 'DINE_IN'}\n`;
      if (isAddition) {
        ticket += `STATUS: DISPATCH TO ACTIVE TABLE\n`;
      }
    }
    ticket += `${divider}\n`;
    ticket += `QTY   ITEM DESCRIPTION\n`;
    ticket += `${divider}\n`;

    for (const item of items) {
      const qtyStr = `${item.quantity} x `.padEnd(6);
      const name = item.name + (item.portion && item.portion !== 'Standard' ? ` (${item.portion})` : '');
      ticket += `${qtyStr}${name}\n`;
      if (item.notes) {
        ticket += `      * Note: ${item.notes}\n`;
      }
    }

    if (notes) {
      ticket += `${divider}\n`;
      ticket += `INSTRUCTIONS: ${notes}\n`;
    }

    if (isAddition) {
      ticket += `${divider}\n`;
      ticket += `${center('PREPARE & DELIVER TO GUEST TABLE')}\n`;
    }

    ticket += `${doubleDivider}\n`;
    ticket += `${center('POWERED BY SWAAD SEVAK POS')}\n\n\n`;

    return ticket;
  }

  /**
   * Internal Thermal Spooler (Silent HTML Iframe Thermal Print)
   * This is the cleanest, most reliable in-app thermal driver:
   * It formats precisely for 58mm/80mm roll, suppresses browser headers/margins,
   * and sends directly to the connected receipt/POS printer without requiring Bluetooth or Wi-Fi!
   */
  printViaInternalSpooler(
    restaurant: Restaurant | null,
    order: Order,
    paperWidth: '58mm' | '80mm' = '80mm',
    addition?: OrderAddition,
    triggerPrintDialog: boolean = false
  ): boolean {
    try {
      const is80mm = paperWidth === '80mm';
      const widthMm = is80mm ? '72mm' : '52mm';
      const widthPx = is80mm ? '300px' : '230px';
      const isAddition = Boolean(addition);
      const items = addition ? addition.items : order.items;
      const notes = addition ? addition.customerNotes : order.customerNotes;

      const orderTime = new Date(addition?.createdAt || order.createdAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const isOnline =
        order.source === 'SWIGGY' ||
        order.source === 'ZOMATO' ||
        order.source === 'OTHER' ||
        order.tableNumber?.toLowerCase().includes('swiggy') ||
        order.tableNumber?.toLowerCase().includes('zomato');

      const channelTitle =
        order.source === 'SWIGGY' || order.tableNumber?.toLowerCase().includes('swiggy')
          ? 'SWIGGY ORDER'
          : order.source === 'ZOMATO' || order.tableNumber?.toLowerCase().includes('zomato')
          ? 'ZOMATO ORDER'
          : order.source === 'OTHER' || order.tableNumber?.toLowerCase().includes('online')
          ? 'ONLINE ORDER'
          : order.tableNumber?.toLowerCase().startsWith('table')
          ? order.tableNumber
          : `Table ${order.tableNumber || 'Counter'}`;

      const orderNum = order.orderNumber.startsWith('#') ? order.orderNumber : `#${order.orderNumber}`;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>KOT - ${orderNum}</title>
  <style>
    @page {
      size: ${paperWidth} auto;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Courier New', Courier, monospace;
      width: ${widthPx};
      max-width: ${widthMm};
      margin: 0 auto;
      padding: 8px 6px;
      font-size: 12px;
      line-height: 1.35;
      color: #000;
      background: #fff;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .border-b { border-bottom: 1px dashed #000; }
    .border-double { border-top: 2px solid #000; border-bottom: 2px solid #000; }
    .my-1 { margin-top: 4px; margin-bottom: 4px; }
    .py-1 { padding-top: 4px; padding-bottom: 4px; }
    .addition-badge {
      background: #000;
      color: #fff;
      padding: 3px 6px;
      font-weight: bold;
      display: inline-block;
      margin: 3px 0;
      font-size: 11px;
      letter-spacing: 1px;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 3px 0;
      border-bottom: 1px dotted #ccc;
    }
    .item-notes {
      font-size: 10px;
      padding-left: 14px;
      font-style: italic;
    }
    @media print {
      body { width: 100%; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="text-center font-bold" style="font-size: 14px; text-transform: uppercase;">
    ${restaurant?.name || 'SWAAD SEVAK'}
  </div>

  ${isAddition ? `
    <div class="text-center my-1">
      <span class="addition-badge">*** TABLE ADD-ON KOT ***</span>
      <div class="font-bold" style="font-size: 13px; margin-top: 2px;">>>> NEW ADDITION <<<</div>
      <div class="font-bold" style="font-size: 11px;">${addition?.additionNumber || 'ADD-ON'} | REF ${orderNum}</div>
    </div>
  ` : `
    <div class="text-center font-bold my-1" style="font-size: 12px; letter-spacing: 1px;">
      *** KITCHEN ORDER TICKET ***
    </div>
    <div class="text-center font-bold my-1" style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 2px 0;">
      ${order.kotNumber || 'KOT-1001'} | ORD ${orderNum}
    </div>
  `}

  <div class="border-b py-1" style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold;">
    <span>${isOnline ? channelTitle : `TABLE: ${channelTitle}`}</span>
    <span>${orderTime}</span>
  </div>

  <div style="font-size: 10px; color: #333; margin: 2px 0;">
    TYPE: ${isOnline ? `${order.source} ONLINE DELIVERY` : (order.source || 'DINE_IN')} ${isAddition ? '• (TABLE ADD-ON)' : ''}
    ${order.estimatedPrepTime ? `• PREP TARGET: ${order.estimatedPrepTime}m` : ''}
  </div>

  <div class="border-b" style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; padding: 3px 0;">
    <span>QTY  ITEM</span>
    <span>PORTION</span>
  </div>

  <div style="padding: 4px 0;">
    ${items.map(item => `
      <div class="item-row">
        <span><strong>${item.quantity}x</strong> ${item.name}</span>
        <span style="font-size: 10px;">${item.portion && item.portion !== 'Standard' ? item.portion : ''}</span>
      </div>
      ${item.notes ? `<div class="item-notes">* Note: ${item.notes}</div>` : ''}
    `).join('')}
  </div>

  ${notes ? `
    <div class="border-b" style="padding: 4px 0; font-size: 11px;">
      <strong>INSTRUCTIONS:</strong> ${notes}
    </div>
  ` : ''}

  ${isAddition ? `
    <div class="text-center font-bold my-1" style="border: 1px dashed #000; padding: 3px; font-size: 10px;">
      PREPARE & DELIVER TO ACTIVE TABLE
    </div>
  ` : ''}

  <div class="text-center" style="font-size: 9px; margin-top: 10px; color: #555; text-transform: uppercase;">
    Powered by Swaad Sevak POS
  </div>
</body>
</html>
      `;

      // 1. Capacitor Native Bridge Support: If Capacitor native Printer plugin is present
      const capacitor = (window as any).Capacitor;
      if (capacitor?.Plugins?.Printer?.print) {
        capacitor.Plugins.Printer.print({ content: htmlContent }).catch((err: any) => {
          console.warn('[KotPrinter] Capacitor native print error, falling back to spooler:', err);
        });
        return true;
      }

      // 2. Direct In-App Thermal Spooler (Android WebView PrintManager / Browser Spooler)
      let iframe = document.getElementById('swaad_thermal_printer_frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'swaad_thermal_printer_frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
      }

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();

        if (triggerPrintDialog) {
          setTimeout(() => {
            try {
              if (iframe.contentWindow) {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
              } else {
                window.print();
              }
            } catch (e) {
              console.warn('[KotPrinter] Spooler print trigger fallback:', e);
              window.print();
            }
          }, 250);
        }

        return true;
      }
      return false;
    } catch (err) {
      console.error('[KotPrinter] Internal spooler error:', err);
      return false;
    }
  }

  /**
   * Main Dispatch: Prints an Order KOT
   * Dispatches silently to connected hardware (WebUSB thermal printer or Network IP printer or Capacitor)
   * If in browser mode with no physical hardware, does not popup window.print() unless explicitly requested via interactiveModal
   */
  async printOrderKot(
    restaurant: Restaurant | null,
    order: Order,
    printerConfig?: PrinterConfig,
    options?: { interactiveModal?: boolean }
  ): Promise<boolean> {
    const paperWidth = printerConfig?.paperWidth || '80mm';

    // 1. WebUSB connected printer
    if (this.activeUsbDevice) {
      try {
        const text = this.generateEscPosText(restaurant, order, paperWidth);
        const ok = await this.printToUsbDevice(text);
        if (ok) return true;
      } catch (err) {
        console.warn('[KotPrinter] USB print error:', err);
      }
    }

    // 2. Network IP thermal printer via backend socket
    if (printerConfig?.printerType === 'NETWORK' && printerConfig?.printerIp) {
      try {
        await api.printKotNetwork(order.id);
        return true;
      } catch (err) {
        console.warn('[KotPrinter] Network printer dispatch failed:', err);
      }
    }

    // 3. Capacitor Native Mobile Bridge
    const capacitor = (window as any).Capacitor;
    if (capacitor?.Plugins?.Printer?.print) {
      return this.printViaInternalSpooler(restaurant, order, paperWidth, undefined, false);
    }

    // 4. Browser fallback:
    // Only open the browser's native print preview dialog IF the user explicitly clicked
    // "Print Ticket" / "Print KOT" (options?.interactiveModal = true).
    // On automatic order acceptance, do NOT open the modal print view!
    if (options?.interactiveModal) {
      return this.printViaInternalSpooler(restaurant, order, paperWidth, undefined, true);
    }

    return true;
  }

  /**
   * Main Dispatch: Prints a New Addition KOT
   * Formats with prominent "TABLE ADD-ON KOT / NEW ADDITION" heading
   */
  async printAdditionKot(
    restaurant: Restaurant | null,
    order: Order,
    addition: OrderAddition,
    printerConfig?: PrinterConfig,
    options?: { interactiveModal?: boolean }
  ): Promise<boolean> {
    const paperWidth = printerConfig?.paperWidth || '80mm';

    if (this.activeUsbDevice) {
      try {
        const text = this.generateEscPosText(restaurant, order, paperWidth, addition);
        const ok = await this.printToUsbDevice(text);
        if (ok) return true;
      } catch (err) {
        console.warn('[KotPrinter] USB print error:', err);
      }
    }

    if (printerConfig?.printerType === 'NETWORK' && printerConfig?.printerIp) {
      try {
        await api.printKotNetwork(order.id, true, addition.id);
        return true;
      } catch (err) {
        console.warn('[KotPrinter] Network printer dispatch failed:', err);
      }
    }

    const capacitor = (window as any).Capacitor;
    if (capacitor?.Plugins?.Printer?.print) {
      return this.printViaInternalSpooler(restaurant, order, paperWidth, addition, false);
    }

    if (options?.interactiveModal) {
      return this.printViaInternalSpooler(restaurant, order, paperWidth, addition, true);
    }

    return true;
  }

  /**
   * Test Print: Dispatches sample KOT to test connected printer
   */
  async testPrint(
    restaurant: Restaurant | null,
    paperWidth: '58mm' | '80mm' = '80mm',
    isAddition = false
  ): Promise<boolean> {
    const sampleOrder: Order = {
      id: 'test_order',
      restaurantId: restaurant?.id || 'rest_demo',
      tableId: 'tbl_01',
      tableNumber: 'Table 01',
      orderNumber: '#101',
      source: 'DINE_IN',
      status: 'ACCEPTED',
      subtotal: 449,
      tax: 22.45,
      total: 471.45,
      kotGenerated: true,
      kotNumber: 'KOT-1042',
      billRequested: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'item_1',
          menuItemId: 'm1',
          name: 'Paneer Butter Masala',
          price: 289,
          quantity: 1,
          portion: 'Standard',
          notes: 'Make it spicy'
        },
        {
          id: 'item_2',
          menuItemId: 'm2',
          name: 'Butter Naan',
          price: 80,
          quantity: 2,
          portion: 'Standard'
        }
      ]
    };

    if (isAddition) {
      const sampleAddition: OrderAddition = {
        id: 'test_addition',
        orderId: 'test_order',
        additionNumber: 'Add-on #1',
        status: 'ACCEPTED',
        subtotal: 160,
        tax: 8,
        total: 168,
        customerNotes: 'Deliver extra green chutney',
        createdAt: new Date().toISOString(),
        items: [
          {
            id: 'item_3',
            menuItemId: 'm3',
            name: 'Garlic Naan',
            price: 90,
            quantity: 2,
            portion: 'Standard',
            notes: 'Extra crisp'
          }
        ]
      };
      return this.printAdditionKot(
        restaurant,
        sampleOrder,
        sampleAddition,
        {
          id: 'cfg',
          printerName: 'Thermal',
          paperWidth,
          autoPrintKot: true,
          printerType: 'BROWSER'
        },
        { interactiveModal: true }
      );
    }

    return this.printOrderKot(
      restaurant,
      sampleOrder,
      {
        id: 'cfg',
        printerName: 'Thermal',
        paperWidth,
        autoPrintKot: true,
        printerType: 'BROWSER'
      },
      { interactiveModal: true }
    );
  }
}

export const kotPrinter = new KotPrinterManager();
