import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Tag,
  FolderPlus,
  Check,
  AlertCircle
} from 'lucide-react';
import { MenuCategory, MenuItem } from '../types';
import { VegIcon } from '../components/VegIcon';
import { AddDishModal } from '../components/AddDishModal';
import { AiMenuModal } from '../components/AiMenuModal';

interface MenuManagementPageProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onToggleStock: (itemId: string, currentStatus: boolean) => Promise<void>;
  onSaveDish: (dishData: any) => Promise<void>;
  onUpdateDish: (dishId: string, dishData: any) => Promise<void>;
  onDeleteDish: (dishId: string) => Promise<void>;
  onCreateCategory: (name: string) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onRefreshMenu: () => void;
}

export const MenuManagementPage: React.FC<MenuManagementPageProps> = ({
  categories,
  items,
  onToggleStock,
  onSaveDish,
  onUpdateDish,
  onDeleteDish,
  onCreateCategory,
  onDeleteCategory,
  onRefreshMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [dishToEdit, setDishToEdit] = useState<MenuItem | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [showAddCatInput, setShowAddCatInput] = useState(false);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.categoryId === selectedCategory;
    const matchesVeg = !filterVegOnly || item.isVeg;
    return matchesSearch && matchesCategory && matchesVeg;
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await onCreateCategory(newCatName.trim());
    setNewCatName('');
    setShowAddCatInput(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Menu & Live Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your dishes, prices, and fast 1-click In-Stock ↔ Out-of-Stock toggles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Menu Importer</span>
          </button>
          <button
            onClick={() => {
              setDishToEdit(null);
              setIsAddDishModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {/* Categories Bar & Quick Add Category */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Menu Categories ({categories.length})
          </span>
          {!showAddCatInput ? (
            <button
              onClick={() => setShowAddCatInput(true)}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Add Category</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCategory} className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="px-3 py-1 rounded-lg border border-slate-300 text-xs outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-orange-600 text-white text-xs hover:bg-orange-700"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowAddCatInput(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <div key={cat.id} className="relative group shrink-0">
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search dishes by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-orange-500 outline-none shadow-xs"
          />
        </div>

        <button
          onClick={() => setFilterVegOnly(!filterVegOnly)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
            filterVegOnly
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <VegIcon isVeg={true} size="sm" />
          <span>Veg Only</span>
        </button>
      </div>

      {/* Dishes Table / Fast Stock Toggle List (Section 31) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Diet</th>
                <th className="py-3 px-4">Dish Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Portion</th>
                <th className="py-3 px-4">Live Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No dishes found matching your search.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const cat = categories.find((c) => c.id === item.categoryId);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        !item.isAvailable ? 'bg-slate-50/40 text-slate-400' : ''
                      }`}
                    >
                      {/* Veg indicator */}
                      <td className="py-3 px-4">
                        <VegIcon isVeg={item.isVeg} size="md" />
                      </td>

                      {/* Name & Tags */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span className={!item.isAvailable ? 'line-through text-slate-400' : ''}>
                            {item.name}
                          </span>
                          {item.tags?.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {cat?.name || 'General'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                        ₹{item.price}
                      </td>

                      {/* Portion */}
                      <td className="py-3 px-4 text-slate-500">
                        {item.portion || 'Standard'}
                      </td>

                      {/* Section 31 Fast Quick Toggle: In Stock <-> Out of Stock */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onToggleStock(item.id, item.isAvailable)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle In Stock / Out of Stock instantly"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Edit & Delete Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setDishToEdit(item);
                              setIsAddDishModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Edit dish"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteDish(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      <AddDishModal
        isOpen={isAddDishModalOpen}
        categories={categories}
        dishToEdit={dishToEdit}
        onClose={() => setIsAddDishModalOpen(false)}
        onSave={async (data) => {
          if (dishToEdit) {
            await onUpdateDish(dishToEdit.id, data);
          } else {
            await onSaveDish(data);
          }
        }}
      />

      {/* AI Menu Importer Modal */}
      <AiMenuModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onMenuImported={onRefreshMenu}
      />
    </div>
  );
};
