import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { MenuCategory, MenuItem } from '../types';
import { VegIcon } from './VegIcon';

interface AddDishModalProps {
  isOpen: boolean;
  categories: MenuCategory[];
  dishToEdit?: MenuItem | null;
  onClose: () => void;
  onSave: (dishData: any) => Promise<void>;
}

export const AddDishModal: React.FC<AddDishModalProps> = ({
  isOpen,
  categories,
  dishToEdit,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(dishToEdit?.name || '');
  const [description, setDescription] = useState(dishToEdit?.description || '');
  const [price, setPrice] = useState(dishToEdit ? String(dishToEdit.price) : '');
  const [categoryId, setCategoryId] = useState(dishToEdit?.categoryId || (categories[0]?.id || ''));
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(categories.length === 0);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [portion, setPortion] = useState(dishToEdit?.portion || 'Standard');
  const [isVeg, setIsVeg] = useState(dishToEdit ? dishToEdit.isVeg : true);
  const [selectedTag, setSelectedTag] = useState(dishToEdit?.tags?.[0] || 'Bestseller');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        tags: selectedTag !== 'None' ? [selectedTag] : []
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900">
            {dishToEdit ? 'Edit Dish' : 'Add New Dish'}
          </h3>
          <button
            onClick={onClose}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Veg / Non-Veg Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dietary Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsVeg(true)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  isVeg
                    ? 'border-green-600 bg-green-50 text-green-800 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <VegIcon isVeg={true} size="sm" />
                <span>Vegetarian</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVeg(false)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  !isVeg
                    ? 'border-red-600 bg-red-50 text-red-800 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <VegIcon isVeg={false} size="sm" />
                <span>Non-Vegetarian</span>
              </button>
            </div>
          </div>

          {/* Dish Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dish Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amritsari Paneer Tikka"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Category *</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategoryMode(!isNewCategoryMode);
                    setErrorMsg('');
                  }}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-orange-300 bg-orange-50/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Creates new category & adds dish to it</p>
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Portion & Special Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Portion / Serving</label>
              <input
                type="text"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="e.g. Standard, Half, 6 Pcs"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Badge</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Appetizing description for your guests..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : dishToEdit ? 'Save Changes' : 'Add Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
