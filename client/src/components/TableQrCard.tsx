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
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Diners Seated</span>;
      case 'BILL_REQUESTED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 animate-pulse">Bill Requested</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Table Ready</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-elevated transition-all overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-slate-900">{table.tableNumber}</span>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRegenerate(table.id)}
            title="Regenerate QR token"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(table.id)}
            title="Delete table"
            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QR Code Canvas */}
      <div ref={qrRef} className="p-6 flex flex-col items-center justify-center bg-white flex-1">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <QRCodeCanvas
            value={table.qrUrl}
            size={160}
            level="H"
            includeMargin={true}
          />
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs font-bold text-slate-800">{table.tableNumber}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Swaad Sevak QR</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100">
        <button
          onClick={downloadTablePng}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-orange-600" />
          <span>Download Standee QR (PNG)</span>
        </button>
      </div>
    </div>
  );
};
