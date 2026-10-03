import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Sparkles, Check, AlertCircle, Edit3, Trash2, Plus } from 'lucide-react';
import { api } from '../services/api';
import { ExtractedMenuItem } from '../types';
import { VegIcon } from './VegIcon';

interface AiMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuImported: () => void;
}

export const AiMenuModal: React.FC<AiMenuModalProps> = ({
  isOpen,
  onClose,
  onMenuImported,
}) => {
  const [step, setStep] = useState<'UPLOAD' | 'PROCESSING' | 'REVIEW'>('UPLOAD');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedItems, setExtractedItems] = useState<ExtractedMenuItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF menu file.');
      return;
    }

    setFile(selectedFile);
    setErrorMsg('');
    setStep('PROCESSING');

    try {
      const res = await api.uploadMenuPdf(selectedFile);
      if (res.success && res.data?.items) {
        setExtractedItems(res.data.items);
        setStep('REVIEW');
      } else {
        throw new Error(res.message || 'Could not parse menu');
      }
    } catch (err: any) {
      setErrorMsg(err.message || "We couldn't process this menu. Please try again or add dishes manually.");
      setStep('UPLOAD');
    }
  };

  // Item editing within review table
  const handleItemChange = (index: number, field: keyof ExtractedMenuItem, value: any) => {
    setExtractedItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteItem = (index: number) => {
    setExtractedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddNewItem = () => {
    setExtractedItems(prev => [
      ...prev,
      {
        category: 'Starters',
        name: 'New Custom Dish',
        description: 'Appetizing house preparation.',
        price: 199,
        portion: 'Standard',
        isVeg: true,
        tags: [],
        confidence: 'HIGH'
      }
    ]);
  };

  const handleConfirmAndAddMenu = async () => {
    if (extractedItems.length === 0) {
      setErrorMsg('Please keep at least one dish in the menu.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.confirmAiMenu(extractedItems);
      onMenuImported();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to import dishes.');
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep('UPLOAD');
    setFile(null);
    setErrorMsg('');
    setExtractedItems([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#140D08]/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl shadow-elevated border border-stone-200 w-full overflow-hidden transition-all duration-300 ${
        step === 'REVIEW' ? 'max-w-4xl max-h-[90vh] flex flex-col' : 'max-w-lg'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {step === 'REVIEW' ? 'Review AI-Extracted Menu' : 'AI Menu Importer'}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 'REVIEW'
                  ? 'Verify, edit, or remove dishes before publishing to your live menu.'
                  : 'Upload your food menu PDF to automatically extract dishes, prices, and categories.'}
              </p>
            </div>
          </div>
          <button
            onClick={resetModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 'UPLOAD' && (
          <div className="p-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-orange-500 bg-orange-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Upload your Restaurant Menu PDF
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Drag & drop your PDF file here, or click to browse. Swaad Sevak AI will automatically organize dishes, prices, categories & portions.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>Max size: 10MB • Multi-page supported</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Supports Indian café, bar, fine-dine, and bakery menus.</span>
              <button
                type="button"
                onClick={resetModal}
                className="text-slate-600 font-semibold hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 'PROCESSING' && (
          <div className="p-12 text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-ping opacity-50" />
              <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Reading & Extracting Menu...
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Analyzing categories, vegetarian indicators, pricing variations, and chef's specials from <span className="font-semibold text-slate-700">{file?.name}</span>.
            </p>
          </div>
        )}

        {/* Step 3: Review & Edit Table */}
        {step === 'REVIEW' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-200/50 flex items-center justify-between text-xs text-amber-900">
              <span className="font-medium">
                ✨ AI detected <strong>{extractedItems.length} dishes</strong>. You can customize, edit prices, change categories, or add items before confirming.
              </span>
              <button
                onClick={handleAddNewItem}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-200 hover:bg-amber-300 font-semibold text-amber-950 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            {/* Scrollable Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Dish Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Price (₹)</th>
                    <th className="py-2.5 px-3">Portion</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {extractedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      {/* Veg / Non-Veg Toggle */}
                      <td className="py-2 px-3">
                        <button
                          type="button"
                          onClick={() => handleItemChange(idx, 'isVeg', !item.isVeg)}
                          className="hover:scale-110 transition-transform"
                          title={item.isVeg ? 'Vegetarian (Click to change)' : 'Non-Vegetarian (Click to change)'}
                        >
                          <VegIcon isVeg={item.isVeg} size="md" />
                        </button>
                      </td>

                      {/* Name & Description */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          className="w-full font-semibold text-slate-900 border border-transparent hover:border-slate-300 focus:border-orange-500 rounded px-2 py-1 text-xs outline-none bg-transparent"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Short description..."
                          className="w-full text-slate-500 border border-transparent hover:border-slate-300 focus:border-orange-500 rounded px-2 py-0.5 text-[11px] outline-none bg-transparent"
                        />
                      </td>

                      {/* Category */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                          className="w-32 border border-slate-200 rounded px-2 py-1 text-xs focus:border-orange-500 outline-none"
                        />
                      </td>

                      {/* Price */}
                      <td className="py-2 px-3">
                        <div className="flex items-center">
                          <span className="text-slate-400 mr-1">₹</span>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
                            className="w-20 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:border-orange-500 outline-none"
                          />
                        </div>
                      </td>

                      {/* Portion */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.portion || 'Standard'}
                          onChange={(e) => handleItemChange(idx, 'portion', e.target.value)}
                          className="w-24 border border-slate-200 rounded px-2 py-1 text-xs focus:border-orange-500 outline-none"
                        />
                      </td>

                      {/* Delete */}
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('UPLOAD')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                ← Upload Different PDF
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmAndAddMenu}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Saving Menu...'
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Publish Menu ({extractedItems.length} Dishes)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
