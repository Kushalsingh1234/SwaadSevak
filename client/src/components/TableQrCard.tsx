import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { TableItem } from '../types';

interface TableQrCardProps {
  table: TableItem;
  restaurantName: string;
  onRegenerate: (tableId: string) => void;
  onDelete: (tableId: string) => void;
  onOpenMenu?: (qrUrl: string) => void;
}

export const TableQrCard: React.FC<TableQrCardProps> = ({
  table,
  restaurantName,
  onRegenerate,
  onDelete,
  onOpenMenu,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadTablePng = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    // Create a styled card canvas for high-res download with restaurant branding
    const cardCanvas = document.createElement('canvas');
    const width = 600;
    const height = 820;
    cardCanvas.width = width;
    cardCanvas.height = height;
    const ctx = cardCanvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Warm saffron header bar
    ctx.fillStyle = '#EA580C';
    ctx.fillRect(0, 0, width, 18);

    // Restaurant Name
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(restaurantName.toUpperCase(), width / 2, 85);

    // Subtitle
    ctx.fillStyle = '#64748B';
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Scan to View Menu & Order', width / 2, 125);

    // Draw QR Code
    const qrSize = 380;
    const qrX = (width - qrSize) / 2;
    const qrY = 170;

    // Border around QR
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 4;
    ctx.strokeRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);

    ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);

    // Table Pill
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 120, 620, 240, 65, 16);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(table.tableNumber.toUpperCase(), width / 2, 665);

    // Instructions
    ctx.fillStyle = '#475569';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('No app download needed • Just scan with mobile camera', width / 2, 725);

    // Powered by Swaad Sevak
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('POWERED BY SWAAD SEVAK', width / 2, 780);

    // Trigger download
    const link = document.createElement('a');
    link.download = `${restaurantName.replace(/\s+/g, '_')}_${table.tableNumber.replace(/\s+/g, '_')}_QR.png`;
    link.href = cardCanvas.toDataURL('image/png');
    link.click();
  };

  const getStatusBadge = () => {
    switch (table.status) {
      case 'OCCUPIED':
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Seated
          </span>
        );
      case 'BILL_REQUESTED':
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-purple-700">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Bill Requested
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Available
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all flex flex-col">
      {/* Card Header */}
      <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm text-gray-900">{table.tableNumber}</span>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRegenerate(table.id)}
            title="Regenerate QR"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(table.id)}
            title="Delete table"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QR Code Canvas */}
      <div ref={qrRef} className="p-6 flex flex-col items-center justify-center bg-white flex-1">
        <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-xs">
          <QRCodeCanvas
            value={table.qrUrl}
            size={150}
            level="H"
            includeMargin={true}
          />
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs font-semibold text-gray-800">{table.tableNumber}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Scan to order</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-200">
        <button
          onClick={downloadTablePng}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-orange-600" />
          <span>Download Standee QR (PNG)</span>
        </button>
      </div>
    </div>
  );
};
