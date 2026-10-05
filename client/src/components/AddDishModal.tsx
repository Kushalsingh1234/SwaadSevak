import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { MenuCategory, MenuItem } from '../types';
import { VegIcon } from './VegIcon';

interface AddDishModalProps {
  isOpen: boolean;
  categories: MenuCategory[];
  dishToEdit?: MenuItem | null;
  onClose: () => void;
  onSave: (dishData: any) => Promise<void>;
  onCreateCategory?: (name: string) => Promise<any>;
}

export const AddDishModal: React.FC<AddDishModalProps> = ({
  isOpen,
  categories,
  dishToEdit,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [portion, setPortion] = useState('Standard');
  const [isVeg, setIsVeg] = useState(true);
  const [selectedTag, setSelectedTag] = useState('Bestseller');
  const [publishSwaadSevak, setPublishSwaadSevak] = useState(true);
  const [publishSwiggy, setPublishSwiggy] = useState(true);
  const [publishZomato, setPublishZomato] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize and pre-fill form fields whenever dishToEdit or isOpen changes
  useEffect(() => {
    if (dishToEdit) {
      setName(dishToEdit.name || '');
      setDescription(dishToEdit.description || '');
      setPrice(dishToEdit.price !== undefined ? String(dishToEdit.price) : '');
      setCategoryId(dishToEdit.categoryId || (categories[0]?.id || ''));
      setPortion(dishToEdit.portion || 'Standard');
      setIsVeg(dishToEdit.isVeg !== undefined ? dishToEdit.isVeg : true);
      setSelectedTag(dishToEdit.tags?.[0] || 'None');
      setIsNewCategoryMode(false);
      setNewCategoryName('');
      setPublishSwaadSevak(true);
      setPublishSwiggy(true);
      setPublishZomato(true);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId(categories[0]?.id || '');
      setPortion('Standard');
      setIsVeg(true);
      setSelectedTag('Bestseller');
      setIsNewCategoryMode(categories.length === 0);
      setNewCategoryName('');
      setPublishSwaadSevak(true);
      setPublishSwiggy(true);
      setPublishZomato(true);
    }
    setErrorMsg('');
  }, [dishToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const popularTags = ['None', 'Bestseller', "Chef's Special", 'Recommended', 'Popular', 'Spicy', 'New'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Dish name is required');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setErrorMsg('Please enter a valid price in INR');
      return;
    }
    if (isNewCategoryMode) {
      if (!newCategoryName.trim()) {
        setErrorMsg('Please enter a new category name');
        return;
      }
    } else {
      if (!categoryId) {
        setErrorMsg('Please select a category or create a new one');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        categoryId: isNewCategoryMode ? undefined : categoryId,
        newCategoryName: isNewCategoryMode ? newCategoryName.trim() : undefined,
        portion,
        isVeg,
        tags: selectedTag !== 'None' ? [selectedTag] : [],
        channels: [
          ...(publishSwaadSevak ? ['SWAAD_SEVAK'] : []),
          ...(publishSwiggy ? ['SWIGGY'] : []),
          ...(publishZomato ? ['ZOMATO'] : [])
        ],
        publishSwiggy,
        publishZomato,
        syncPriceToAggregators: publishSwiggy || publishZomato
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/70">
          <h3 className="text-sm font-bold text-gray-900">
            {dishToEdit ? 'Edit Dish' : 'Add New Dish'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Veg / Non-Veg Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Dietary Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsVeg(true)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  isVeg
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <VegIcon isVeg={true} size="sm" />
                <span>Vegetarian</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVeg(false)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  !isVeg
                    ? 'border-red-500 bg-red-50 text-red-800 shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <VegIcon isVeg={false} size="sm" />
                <span>Non-Vegetarian</span>
              </button>
            </div>
          </div>

          {/* Dish Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Dish Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amritsari Paneer Tikka"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">Category *</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategoryMode(!isNewCategoryMode);
                    setErrorMsg('');
                  }}
                  className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  {isNewCategoryMode ? '← Pick Existing' : '+ New Category'}
                </button>
              </div>

              {isNewCategoryMode ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Tandoori Specials"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-orange-300 bg-orange-50/30 focus:border-orange-500 outline-none"
                  />
                  <p className="text-[10px] text-gray-500">Creates new category & adds dish to it</p>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsNewCategoryMode(true);
                    } else {
                      setCategoryId(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="__NEW__">+ Create New Category...</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Portion & Special Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Portion / Serving</label>
              <input
                type="text"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="e.g. Standard, Half, 6 Pcs"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Special Badge</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all"
              >
                {popularTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description of the dish..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>

          {/* Aggregator Channel Publishing */}
          <div className="p-3.5 bg-orange-50/70 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="block text-xs font-bold text-gray-900">Publish Price & Availability To:</span>
              <span className="text-[10px] text-orange-700 font-bold bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-200">
                Auto-syncs ₹{price ? parseFloat(price) || 0 : 0}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-1.5 font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishSwaadSevak}
                  onChange={(e) => setPublishSwaadSevak(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Swaad Sevak (Dine-In QR)</span>
              </label>
              <label className="flex items-center gap-1.5 font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishSwiggy}
                  onChange={(e) => setPublishSwiggy(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-[#FC8019] font-bold">Swiggy</span>
              </label>
              <label className="flex items-center gap-1.5 font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishZomato}
                  onChange={(e) => setPublishZomato(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-[#E23744] font-bold">Zomato</span>
              </label>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              Selected channels will immediately update their item pricing to ₹{price || 0} upon saving.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : dishToEdit ? 'Save Changes' : 'Add Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
