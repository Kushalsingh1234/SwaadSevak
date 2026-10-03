import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  FolderPlus,
  Check,
  X,
  LayoutGrid,
  List,
  Sparkles,
  Tag,
  CheckCircle2
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
  const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');
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

  const inStockCount = items.filter(i => i.isAvailable).length;
  const outOfStockCount = items.filter(i => !i.isAvailable).length;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Menu & Inventory Stock
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-slate-700">
              {items.length} items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {inStockCount} In Stock • {outOfStockCount > 0 ? `${outOfStockCount} Marked 86'd` : 'All items active'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-slate-700 hover:bg-stone-50 text-xs font-semibold transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>AI Menu Importer</span>
          </button>
          <button
            onClick={() => {
              setDishToEdit(null);
              setIsAddDishModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Dish</span>
          </button>
        </div>
      </div>

      {/* Filter and Categories Control Card */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-3.5 space-y-3">
        {/* Category Chips Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-stone-100'
              }`}
            >
              All Categories ({items.length})
            </button>

            {categories.map((cat) => {
              const count = items.filter(i => i.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="relative group shrink-0">
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">({count})</span>
                  </button>
                </div>
              );
            })}

            {/* Quick Add Category Button */}
            {!showAddCatInput ? (
              <button
                onClick={() => setShowAddCatInput(true)}
                className="px-2.5 py-1.5 rounded-lg border border-dashed border-stone-300 text-slate-500 hover:text-slate-800 hover:border-stone-400 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Category</span>
              </button>
            ) : (
              <form onSubmit={handleCreateCategory} className="flex items-center gap-1">
                <input
                  type="text"
                  autoFocus
                  placeholder="Category Name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="p-1 rounded bg-brand-500 text-white hover:bg-brand-600"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCatInput(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Search, Veg Filter, and Grid/List Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2.5 border-t border-stone-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                filterVegOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
              }`}
            >
              <VegIcon isVeg={true} size="sm" />
              <span>Veg Only</span>
            </button>

            <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5">
              <button
                onClick={() => setViewMode('LIST')}
                className={`p-1.5 rounded-md ${viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={`p-1.5 rounded-md ${viewMode === 'GRID' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dishes Display: List View */}
      {viewMode === 'LIST' ? (
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No dishes found matching your search. Click <b className="text-slate-700">+ Add Dish</b> to add an item.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Live Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Dish Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0">
                            <VegIcon isVeg={item.isVeg} size="sm" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                            {item.portion && (
                              <span className="text-[11px] text-slate-400 ml-1.5 font-normal">({item.portion})</span>
                            )}
                            {item.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 hidden sm:table-cell text-slate-600 font-medium">
                        {getCategoryName(item.categoryId)}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums text-sm">
                        ₹{item.price}
                      </td>

                      {/* Stock Availability Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onToggleStock(item.id, item.isAvailable)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-slate-500 border-stone-200 hover:bg-stone-200'
                          }`}
                          title={item.isAvailable ? 'Click to mark 86 (Out of Stock)' : 'Click to mark In Stock'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                          <span>{item.isAvailable ? 'In Stock' : '86’d (Out)'}</span>
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
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Dishes Display: Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-xs flex flex-col justify-between card-hover-lift">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <VegIcon isVeg={item.isVeg} size="sm" />
                    <span className="text-[11px] font-semibold text-slate-500">{getCategoryName(item.categoryId)}</span>
                  </div>
                  <button
                    onClick={() => onToggleStock(item.id, item.isAvailable)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-stone-100 text-slate-500 border-stone-200'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Out'}
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                {item.portion && (
                  <p className="text-[11px] text-slate-400">{item.portion}</p>
                )}
                {item.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-base font-bold text-slate-900 tabular-nums">₹{item.price}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setDishToEdit(item);
                      setIsAddDishModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteDish(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
