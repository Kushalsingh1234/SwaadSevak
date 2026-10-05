import React, { useState } from 'react';
import { formatINR } from '../../lib/utils';
import { Clock, Printer } from 'lucide-react';

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
      
      {/* Large Laptop Frame showing Table-View Floor Map POS */}
      <div className="device-laptop-frame p-3 sm:p-4 bg-espresso text-white">
        
        {/* Laptop Camera dot */}
        <div className="w-2 h-2 rounded-full bg-walnut mx-auto mb-2.5" />

        {/* Screen Content */}
        <div className="rounded-xl overflow-hidden bg-cream text-espresso min-h-[380px] sm:min-h-[440px] flex flex-col border border-sand-200">
          
          {/* POS Top Navbar */}
          <div className="bg-espresso text-white p-3 px-4 flex items-center justify-between text-xs border-b border-walnut">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              <span className="font-bold tracking-wide text-white">SwaadSevak POS</span>
              <span className="text-sand-100 text-[10px] font-mono hidden sm:inline font-bold">• Live Floor: 5/8 Seated</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-orange-400 font-extrabold">Shift: Lunch Rush</span>
              <span className="text-sand-100 font-medium">Captain: Rajesh</span>
            </div>
          </div>

          {/* Main Floor Plan Grid */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 bg-cream">
            
            {/* Tables Grid (8 Cols) */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-espresso uppercase tracking-wider text-[11px] font-mono">
                  Ground Floor Tables
                </span>
                <div className="flex gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-espresso">
                    <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Free
                  </span>
                  <span className="flex items-center gap-1.5 text-espresso">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Seated
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {tables.map((tbl) => (
                  <button
                    key={tbl.id}
                    onClick={() => setSelectedTable(tbl.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tbl.id === selectedTable
                        ? 'bg-orange-100/90 border-orange-500 ring-2 ring-orange-500/40 shadow-soft'
                        : tbl.status === 'occupied'
                        ? 'bg-white border-sand-300 shadow-soft hover:border-orange-400'
                        : 'bg-sand-50 border-sand-200 text-espresso hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-espresso">{tbl.name}</span>
                      <span className="text-[10px] font-bold text-walnut">{tbl.seats}P</span>
                    </div>
                    {tbl.status === 'occupied' || tbl.id === selectedTable ? (
                      <div>
                        <span className="font-mono font-extrabold text-xs text-orange-dark block">
                          {formatINR(tbl.bill)}
                        </span>
                        <span className="text-[10px] font-medium text-walnut flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> {tbl.time}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-extrabold text-success block mt-2">Available</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Table Ticket Panel (4 Cols) */}
            <div className="md:col-span-4 p-3.5 rounded-xl bg-white border border-sand-300 flex flex-col justify-between text-xs shadow-soft">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                  <span className="font-extrabold text-espresso">Table 04 Active KOT</span>
                  <span className="text-[10px] font-mono bg-orange-500 text-espresso px-2 py-0.5 rounded font-extrabold">
                    KOT #108
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px] text-espresso font-semibold">
                  <div className="flex justify-between">
                    <span>2x Dal Makhani</span>
                    <span className="font-bold">₹460</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4x Butter Naan</span>
                    <span className="font-bold">₹240</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Chicken Biryani</span>
                    <span className="font-bold">₹380</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-sand-300 flex justify-between font-extrabold text-xs text-espresso">
                  <span>Total (incl. 5% GST):</span>
                  <span className="text-orange-dark font-mono text-sm font-extrabold">₹1,134</span>
                </div>
              </div>

              <div className="pt-3">
                <button className="w-full py-2.5 rounded-lg bg-orange-500 text-espresso font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-soft hover:bg-orange-600 transition-colors cursor-pointer">
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

    </div>
  );
};
