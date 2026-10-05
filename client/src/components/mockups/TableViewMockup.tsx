import React, { useState } from 'react';
import { formatINR } from '../../lib/utils';
import {
  Layers,
  Users,
  Clock,
  Printer,
  QrCode,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Flame,
  Search,
} from 'lucide-react';

export const TableViewMockup: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number>(4);

  const tables = [
    { id: 1, name: 'T-01', seats: 2, status: 'occupied', bill: 480, time: '24m' },
    { id: 2, name: 'T-02', seats: 4, status: 'available', bill: 0, time: '' },
    { id: 3, name: 'T-03', seats: 4, status: 'occupied', bill: 1120, time: '38m' },
    { id: 4, name: 'T-04', seats: 6, status: 'selected', bill: 1680, time: '18m' },
    { id: 5, name: 'T-05', seats: 2, status: 'available', bill: 0, time: '' },
    { id: 6, name: 'T-06', seats: 8, status: 'occupied', bill: 2450, time: '45m' },
    { id: 7, name: 'T-07', seats: 4, status: 'available', bill: 0, time: '' },
    { id: 8, name: 'T-08', seats: 4, status: 'occupied', bill: 890, time: '12m' },
  ];

  return (
    <div className="relative w-full max-w-[1000px] mx-auto text-left font-sans select-none">
      
      {/* 1. Large Laptop Frame showing Table-View Floor Map POS */}
      <div className="device-laptop-frame p-3 sm:p-4 bg-espresso text-espresso-50">
        
        {/* Laptop Camera dot */}
        <div className="w-2 h-2 rounded-full bg-walnut mx-auto mb-2.5" />

        {/* Screen Content */}
        <div className="rounded-xl overflow-hidden bg-cream text-espresso min-h-[380px] sm:min-h-[440px] flex flex-col border border-sand-200">
          
          {/* POS Top Navbar */}
          <div className="bg-espresso text-white p-3 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              <span className="font-bold tracking-wide">SwaadSevak POS</span>
              <span className="text-sand-200 text-[10px] font-mono hidden sm:inline">• Live Floor: 5/8 Seated</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-orange font-bold">Shift: Lunch Rush</span>
              <span className="text-sand-300">Captain: Rajesh</span>
            </div>
          </div>

          {/* Main Floor Plan Grid */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
            
            {/* Tables Grid (8 Cols) */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs text-bodyText">
                <span className="font-bold text-espresso uppercase tracking-wider text-[10px] font-mono">
                  Ground Floor Tables
                </span>
                <div className="flex gap-2 text-[10px] font-medium">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Free</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange" /> Seated</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {tables.map((tbl) => (
                  <button
                    key={tbl.id}
                    onClick={() => setSelectedTable(tbl.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tbl.id === selectedTable
                        ? 'bg-orange-50 border-orange ring-2 ring-orange/30 shadow-soft'
                        : tbl.status === 'occupied'
                        ? 'bg-white border-sand-200 shadow-soft'
                        : 'bg-sand-50/60 border-sand-200 text-bodyText hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-espresso">{tbl.name}</span>
                      <span className="text-[10px] text-bodyText">{tbl.seats}P</span>
                    </div>
                    {tbl.status === 'occupied' || tbl.id === selectedTable ? (
                      <div>
                        <span className="font-mono font-bold text-xs text-orange-dark block">
                          {formatINR(tbl.bill)}
                        </span>
                        <span className="text-[9px] text-bodyText flex items-center gap-0.5 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> {tbl.time}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-medium text-success block mt-2">Available</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Table Ticket Panel (4 Cols) */}
            <div className="md:col-span-4 p-3.5 rounded-xl bg-sand-50 border border-sand-200 flex flex-col justify-between text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                  <span className="font-bold text-espresso">Table 04 Active KOT</span>
                  <span className="text-[10px] font-mono bg-orange text-espresso px-1.5 py-0.5 rounded font-bold">
                    KOT #108
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px] text-espresso">
                  <div className="flex justify-between">
                    <span>2x Dal Makhani</span>
                    <span>₹460</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4x Butter Naan</span>
                    <span>₹240</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Chicken Biryani</span>
                    <span>₹380</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-sand-300 flex justify-between font-bold text-xs text-espresso">
                  <span>Total (incl. 5% GST):</span>
                  <span className="text-orange-dark font-mono">₹1,134</span>
                </div>
              </div>

              <div className="pt-3">
                <button className="w-full py-2 rounded-lg bg-orange text-espresso font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft hover:bg-orange-hover transition-colors">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Final Bill</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Laptop Base */}
        <div className="device-laptop-base mt-0 mx-auto w-[102%]" />
      </div>

      {/* 2. Overlapping Mobile Phone Frame (Bottom-Right) */}
      <div className="hidden sm:block absolute -bottom-8 -right-4 w-[240px] device-phone-frame p-2.5 bg-espresso shadow-elevated z-20">
        <div className="w-16 h-3 bg-cocoa rounded-full mx-auto mb-2" />
        <div className="rounded-[24px] bg-white p-3 text-xs text-left space-y-2.5 border border-sand-200">
          <div className="flex items-center justify-between border-b pb-1.5 font-mono text-[10px]">
            <span className="font-bold text-espresso">FAST BILLING</span>
            <span className="text-success font-bold">UPI QR</span>
          </div>

          <div className="p-2.5 rounded-xl bg-sand-50 text-center space-y-1">
            <QrCode className="w-12 h-12 mx-auto text-espresso" />
            <span className="block font-mono font-bold text-xs text-orange-dark">₹1,134.00</span>
            <span className="text-[9px] text-bodyText block">Scan via GPay / PhonePe / Paytm</span>
          </div>

          <button className="w-full py-2 rounded-lg bg-espresso text-white font-bold text-[10px] flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-success" />
            <span>Settle & Send WhatsApp Bill</span>
          </button>
        </div>
      </div>

      {/* 3. Floating Order Notification Chips */}
      <div className="hidden md:flex absolute -top-5 left-8 p-3 rounded-xl bg-cocoa border border-walnut shadow-elevated text-white text-xs items-center gap-2.5 z-20 animate-float-slow">
        <span className="w-2.5 h-2.5 rounded-full bg-success" />
        <span className="font-mono font-bold text-orange">Zomato #492</span>
        <span className="text-sand-200 text-[11px]">1x Dum Biryani • Auto-Accepted</span>
      </div>

      <div className="hidden md:flex absolute bottom-12 -left-6 p-3 rounded-xl bg-cocoa border border-walnut shadow-elevated text-white text-xs items-center gap-2.5 z-20 animate-float-slow" style={{ animationDelay: '2s' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-orange" />
        <span className="font-mono font-bold text-white">Table 09</span>
        <span className="text-sand-200 text-[11px]">QR Order Dispatched to Barista</span>
      </div>

    </div>
  );
};
