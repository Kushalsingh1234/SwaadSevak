import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Download,
  Plus,
  Layers,
  X,
  Check,
  TableProperties,
  QrCode
} from 'lucide-react';
import QRCode from 'qrcode';
import { TableItem, Restaurant } from '../types';
import { TableQrCard } from '../components/TableQrCard';
import { api } from '../services/api';

interface TablesManagementPageProps {
  restaurant: Restaurant | null;
  tables: TableItem[];
  onRefreshTables: () => void;
}

export const TablesManagementPage: React.FC<TablesManagementPageProps> = ({
  restaurant,
  tables,
  onRefreshTables,
}) => {
  const [isAddingSingle, setIsAddingSingle] = useState(false);
  const [singleTableNumber, setSingleTableNumber] = useState('');
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [bulkCount, setBulkCount] = useState(5);
  const [isZipping, setIsZipping] = useState(false);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleTableNumber.trim()) return;
    try {
      await api.createTable(singleTableNumber.trim());
      setSingleTableNumber('');
      setIsAddingSingle(false);
      onRefreshTables();
    } catch (err) {
      console.error('Failed to add table:', err);
    }
  };

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.bulkCreateTables(bulkCount, 'Table ');
      setIsBulkAdding(false);
      onRefreshTables();
    } catch (err) {
      console.error('Failed bulk add:', err);
    }
  };

  const handleRegenerate = async (tableId: string) => {
    if (!window.confirm('Regenerating this QR code will revoke previous printed QR codes for this table. Continue?')) {
      return;
    }
    try {
      await api.regenerateTableQr(tableId);
      onRefreshTables();
    } catch (err) {
      console.error('Failed to regenerate table QR:', err);
    }
  };

  const handleDelete = async (tableId: string) => {
    if (!window.confirm('Are you sure you want to delete this table?')) {
      return;
    }
    try {
      await api.deleteTable(tableId);
      onRefreshTables();
    } catch (err) {
      console.error('Failed to delete table:', err);
    }
  };

  const handleDownloadAllZip = async () => {
    if (tables.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `${restaurant?.name.replace(/\s+/g, '_') || 'Restaurant'}_QR_Codes`;
      const imgFolder = zip.folder(folderName);

      for (const table of tables) {
        const cardCanvas = document.createElement('canvas');
        const width = 600;
        const height = 820;
        cardCanvas.width = width;
        cardCanvas.height = height;
        const ctx = cardCanvas.getContext('2d');
        if (!ctx) continue;

        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Header bar
        ctx.fillStyle = '#F25C05';
        ctx.fillRect(0, 0, width, 18);

        // Restaurant Name
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((restaurant?.name || 'SWAAD SEVAK').toUpperCase(), width / 2, 85);

        // Subtitle
        ctx.fillStyle = '#64748B';
        ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Scan to View Menu & Order', width / 2, 125);

        // QR Code
        const qrDataUrl = await QRCode.toDataURL(table.qrUrl, {
          width: 380,
          margin: 1,
          color: { dark: '#0F172A', light: '#FFFFFF' }
        });
        const qrImg = new Image();
        await new Promise((resolve) => {
          qrImg.onload = resolve;
          qrImg.src = qrDataUrl;
        });

        // Border around QR
        const qrSize = 380;
        const qrX = (width - qrSize) / 2;
        const qrY = 170;
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 4;
        ctx.strokeRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

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
        ctx.fillText('No app download needed • Just scan with phone camera', width / 2, 725);

        // Powered by Swaad Sevak
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('POWERED BY SWAAD SEVAK', width / 2, 780);

        const dataUrl = cardCanvas.toDataURL('image/png');
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        imgFolder?.file(`${table.tableNumber.replace(/\s+/g, '_')}_Standee_QR.png`, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${folderName}.zip`);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const occupiedCount = tables.filter(t => t.status === 'OCCUPIED').length;
  const billRequestedCount = tables.filter(t => t.status === 'BILL_REQUESTED').length;
  const availableCount = tables.filter(t => t.status === 'AVAILABLE' || !t.status).length;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Dining Tables & Standee QRs
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-slate-700">
              {tables.length} tables
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {availableCount} Available • {occupiedCount} Seated • {billRequestedCount} Bill Requested
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {tables.length > 0 && (
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-slate-700 hover:bg-stone-50 text-xs font-semibold transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-brand-500" />
              <span>{isZipping ? 'Generating Standees...' : 'Download All Standees (ZIP)'}</span>
            </button>
          )}

          <button
            onClick={() => setIsBulkAdding(!isBulkAdding)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-slate-700 hover:bg-stone-50 text-xs font-semibold transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Bulk Add</span>
          </button>

          <button
            onClick={() => setIsAddingSingle(!isAddingSingle)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Table</span>
          </button>
        </div>
      </div>

      {/* Single Add Table Inline Form */}
      {isAddingSingle && (
        <form onSubmit={handleAddTable} className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-wrap items-center gap-2 sm:gap-3">
          <input
            type="text"
            autoFocus
            placeholder="e.g. Table 05 or Balcony 01"
            value={singleTableNumber}
            onChange={(e) => setSingleTableNumber(e.target.value)}
            className="flex-1 min-w-[160px] px-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:outline-hidden focus:border-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shrink-0"
          >
            Create Table
          </button>
          <button
            type="button"
            onClick={() => setIsAddingSingle(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Bulk Add Inline Form */}
      {isBulkAdding && (
        <form onSubmit={handleBulkAdd} className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="text-xs text-slate-600 font-medium">How many tables to add?</label>
          <input
            type="number"
            min="1"
            max="30"
            value={bulkCount}
            onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:outline-hidden focus:border-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shrink-0"
          >
            Generate {bulkCount} Tables
          </button>
          <button
            type="button"
            onClick={() => setIsBulkAdding(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-16 text-center text-xs text-slate-400">
          No dining tables created yet. Click <b className="text-slate-700">+ Add Table</b> or Bulk Add to generate your printable standee QRs.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {tables.map((table) => (
            <TableQrCard
              key={table.id}
              table={table}
              restaurantName={restaurant?.name || 'Swaad Sevak'}
              onRegenerate={handleRegenerate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
