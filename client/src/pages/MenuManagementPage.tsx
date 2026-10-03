import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  FolderPlus,
  Check,
  X
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

  useEffect(() => {
    onRefreshMenu();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const getCategoryName = (catId: string) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : 'General';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Menu
          </h1>
          <p className="text-xs text-gray-500">
            Manage your dishes and real-time inventory availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Import PDF</span>
          </button>
          <button
            onClick={() => {
              setDishToEdit(null);
              setIsAddDishModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Dish</span>
          </button>
        </div>
      </div>

      {/* Categories & Search Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-3 space-y-3">
        {/* Categories Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Dishes ({items.length})
            </button>

            {categories.map((cat) => {
              const count = items.filter(i => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-gray-900 text-white font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {!showAddCatInput ? (
            <button
              onClick={() => setShowAddCatInput(true)}
              className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0 ml-2"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Category</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCategory} className="flex items-center gap-1.5 shrink-0">
              <input
                type="text"
                autoFocus
                placeholder="Category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-orange-500"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowAddCatInput(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Search & Veg Filter */}
        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:border-orange-500 transition-colors"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterVegOnly}
              onChange={(e) => setFilterVegOnly(e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Vegetarian only</span>
          </label>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">
            No dishes found. Click <b className="text-gray-700">+ Add Dish</b> or import a menu to get started.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Dish Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        <VegIcon isVeg={item.isVeg} size="sm" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                        {item.portion && (
                          <span className="text-[11px] text-gray-400 ml-1.5 font-normal">({item.portion})</span>
                        )}
                        {item.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 hidden sm:table-cell text-gray-600">
                    {getCategoryName(item.categoryId)}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-gray-900">
                    ₹{item.price}
                  </td>

                  {/* Stock Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleStock(item.id, item.isAvailable)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                      }`}
                      title={item.isAvailable ? 'Click to mark Out of Stock' : 'Click to mark In Stock'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-600' : 'bg-gray-400'}`} />
                      <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setDishToEdit(item);
                          setIsAddDishModalOpen(true);
                        }}
                        className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Edit dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDish(item.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      <AddDishModal
        isOpen={isAddDishModalOpen}
        categories={categories}
        dishToEdit={dishToEdit}
        onClose={() => {
          setIsAddDishModalOpen(false);
          setDishToEdit(null);
        }}
        onSave={dishToEdit ? (data) => onUpdateDish(dishToEdit.id, data) : onSaveDish}
        onCreateCategory={onCreateCategory}
      />

      {/* AI Menu Importer Modal */}
      <AiMenuModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onMenuImported={() => {
          setIsAiModalOpen(false);
          onRefreshMenu();
        }}
      />
    </div>
  );
};
