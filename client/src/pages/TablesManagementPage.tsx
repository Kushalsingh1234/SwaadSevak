import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  QrCode,
  Download,
  Plus,
  RefreshCw,
  Archive,
  ExternalLink,
  Layers,
  Sparkles,
  Check
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

  // Section 14: Download All QR Codes as ZIP
  const handleDownloadAllZip = async () => {
    if (tables.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `${restaurant?.name.replace(/\s+/g, '_') || 'Restaurant'}_QR_Codes`;
      const imgFolder = zip.folder(folderName);

      // Generate canvas for each table and append to ZIP
      for (const table of tables) {
        const cardCanvas = document.createElement('canvas');
        const width = 600;
        const height = 820;
        cardCanvas.width = width;
        cardCanvas.height = height;
        const ctx = cardCanvas.getContext('2d');
        if (!ctx) continue;

        // Background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Header bar
        ctx.fillStyle = '#EA580C';
        ctx.fillRect(0, 0, width, 18);

        // Restaurant Name
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(restaurant?.name.toUpperCase() || 'SWAAD SEVAK', width / 2, 85);

        ctx.fillStyle = '#64748B';
        ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Scan to View Menu & Order', width / 2, 125);

        // Generate QR on an offscreen canvas
        const offscreenCanvas = document.createElement('canvas');
        await QRCode.toCanvas(offscreenCanvas, table.qrUrl, {
          width: 380,
          margin: 2,
          color: { dark: '#0F172A', light: '#FFFFFF' }
        });

        const qrX = (width - 380) / 2;
        const qrY = 170;

        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 4;
        ctx.strokeRect(qrX - 16, qrY - 16, 380 + 32, 380 + 32);
        ctx.drawImage(offscreenCanvas, qrX, qrY);

        // Table Pill
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 120, 620, 240, 65, 16);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(table.tableNumber.toUpperCase(), width / 2, 665);

        // Subtext
        ctx.fillStyle = '#475569';
        ctx.font = '16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('No app download needed • Just scan with mobile camera', width / 2, 725);

        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('POWERED BY SWAAD SEVAK', width / 2, 780);

        // Convert canvas to blob
        const dataUrl = cardCanvas.toDataURL('image/png');
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        const filename = `${table.tableNumber.replace(/\s+/g, '-')}-QR.png`;
        imgFolder?.file(filename, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${folderName}.zip`);
    } catch (err) {
      console.error('ZIP generation error:', err);
      alert('Could not generate ZIP. You can still download individual table QR cards.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Table QR Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every table has a unique, secure QR code linking directly to that table's dine-in menu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download All ZIP Button (Section 14) */}
          <button
            onClick={handleDownloadAllZip}
            disabled={isZipping || tables.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            title="Download all table QR cards as a ready-to-print ZIP"
          >
            <Archive className="w-3.5 h-3.5 text-orange-400" />
            <span>{isZipping ? 'Creating ZIP...' : `Download All QRs (ZIP)`}</span>
          </button>

          <button
            onClick={() => setIsBulkAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>+ Bulk Add</span>
          </button>

          <button
            onClick={() => setIsAddingSingle(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {/* Add Single Table Modal */}
      {isAddingSingle && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
            <QrCode className="w-4 h-4 text-orange-600" />
            <span>Add Single Table</span>
          </div>
          <form onSubmit={handleAddTable} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Table 09, Rooftop 1, Booth A"
              value={singleTableNumber}
              onChange={(e) => setSingleTableNumber(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-orange-300 text-xs bg-white outline-none focus:ring-1 focus:ring-orange-500 w-full sm:w-60"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAddingSingle(false)}
              className="px-3 py-1.5 rounded-xl text-slate-600 text-xs hover:bg-orange-100"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Bulk Add Tables Modal */}
      {isBulkAdding && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Bulk Add Consecutive Tables</span>
          </div>
          <form onSubmit={handleBulkAdd} className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-amber-900">How many tables?</span>
            <input
              type="number"
              min="1"
              max="30"
              value={bulkCount}
              onChange={(e) => setBulkCount(parseInt(e.target.value, 10) || 1)}
              className="w-16 px-2 py-1.5 rounded-xl border border-amber-300 text-xs bg-white text-center font-bold outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
            >
              Generate Tables
            </button>
            <button
              type="button"
              onClick={() => setIsBulkAdding(false)}
              className="px-3 py-1.5 rounded-xl text-slate-600 text-xs hover:bg-amber-100"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Grid of Table QR Cards (Section 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
};
