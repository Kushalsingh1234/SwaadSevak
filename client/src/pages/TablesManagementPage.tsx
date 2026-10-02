import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Download,
  Plus,
  Layers,
  X,
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

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#EA580C';
        ctx.fillRect(0, 0, width, 18);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(restaurant?.name.toUpperCase() || 'SWAAD SEVAK', width / 2, 85);

        ctx.fillStyle = '#64748B';
        ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Scan to View Menu & Order', width / 2, 125);

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

        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 130, 600, 260, 64, 16);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(table.tableNumber.toUpperCase(), width / 2, 642);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('No app download required • Instant UPI payment', width / 2, 700);

        ctx.fillStyle = '#CBD5E1';
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('POWERED BY SWAAD SEVAK RESTAURANT OS', width / 2, 755);

        const dataUrl = cardCanvas.toDataURL('image/png');
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        const filename = `${table.tableNumber.replace(/\s+/g, '_')}_QR_Standee.png`;
        imgFolder?.file(filename, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${restaurant?.name || 'Restaurant'}_All_Table_QRs.zip`);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Tables & QR
          </h1>
          <p className="text-xs text-gray-500">
            Generate and manage QR codes for your dining tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tables.length > 0 && (
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>{isZipping ? 'Creating ZIP...' : 'Download All QR'}</span>
            </button>
          )}

          <button
            onClick={() => setIsBulkAdding(!isBulkAdding)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-gray-500" />
            <span>Bulk Add</span>
          </button>

          <button
            onClick={() => setIsAddingSingle(!isAddingSingle)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Table</span>
          </button>
        </div>
      </div>

      {/* Single Add Table Inline Form */}
      {isAddingSingle && (
        <form onSubmit={handleAddTable} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <input
            type="text"
            autoFocus
            placeholder="e.g. Table 05 or Balcony 01"
            value={singleTableNumber}
            onChange={(e) => setSingleTableNumber(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-hidden focus:border-orange-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold"
          >
            Create Table
          </button>
          <button
            type="button"
            onClick={() => setIsAddingSingle(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Bulk Add Inline Form */}
      {isBulkAdding && (
        <form onSubmit={handleBulkAdd} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <label className="text-xs text-gray-600 font-medium">How many tables to add?</label>
          <input
            type="number"
            min="1"
            max="30"
            value={bulkCount}
            onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-hidden focus:border-orange-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold"
          >
            Generate {bulkCount} Tables
          </button>
          <button
            type="button"
            onClick={() => setIsBulkAdding(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-16 text-center text-xs text-gray-400">
          No tables created yet. Click <b className="text-gray-700">+ Add Table</b> or Bulk Add to generate QR codes.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
