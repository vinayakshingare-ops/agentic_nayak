"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  ShoppingCart,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  ListFilter,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { GroceryCategory, GroceryItem } from "@/types";

export default function GroceryPage() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Add custom item modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customCategory, setCustomCategory] = useState<GroceryCategory>("vegetables");

  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchGroceries = async () => {
    try {
      const res = await fetch("/api/grocery");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  const handleToggle = async (itemId: string) => {
    try {
      const res = await fetch("/api/grocery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", itemId }),
      });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    try {
      const res = await fetch("/api/grocery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          name: customName.trim(),
          amount: customAmount.trim() || "1 unit",
          category: customCategory,
        }),
      });
      const data = await res.json();
      if (data.item) {
        setItems([data.item, ...items]);
        setCustomName("");
        setCustomAmount("");
        setAddModalOpen(false);
        showToast("Item added to grocery list!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/grocery?id=${itemId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/grocery", { method: "PUT" });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
        showToast("Regenerated grocery list from your active meal plan!");
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearPurchased = async () => {
    try {
      const res = await fetch("/api/grocery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_purchased" }),
      });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
        showToast("Cleared purchased items!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-600">Compiling shopping list...</p>
      </div>
    );
  }

  const purchasedCount = items.filter((i) => i.isPurchased).length;
  const progressPercent =
    items.length > 0 ? Math.round((purchasedCount / items.length) * 100) : 0;

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "All Items" },
    { id: "vegetables", label: "Vegetables 🥦" },
    { id: "fruits", label: "Fruits 🍎" },
    { id: "grains", label: "Grains & Cereals 🌾" },
    { id: "protein", label: "Protein 🍗" },
    { id: "dairy", label: "Dairy & Milk 🥛" },
    { id: "pantry", label: "Pantry & Spices 🧂" },
    { id: "other", label: "Other" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header />

      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Smart Shopping Cart
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Personal Grocery List
            </h1>
            <p className="text-xs text-slate-500">
              Auto-extracted ingredients from your active 7-day personalized diet plan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRegenerate}
              className="text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Regenerate
            </Button>
            <Button
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Progress & Quick Stats Card */}
        <Card className="p-5 bg-white border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-900">
                Purchased Progress: {purchasedCount} of {items.length} items
              </span>
              <span className="text-xs font-semibold text-slate-400 ml-2">
                ({progressPercent}%)
              </span>
            </div>
            {purchasedCount > 0 && (
              <button
                onClick={handleClearPurchased}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700"
              >
                Clear Purchased
              </button>
            )}
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </Card>

        {/* Category Pills */}
        <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((c) => {
              const count =
                c.id === "all"
                  ? items.length
                  : items.filter((i) => i.category === c.id).length;
              const isSelected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  {c.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Items List */}
        <Card className="p-6 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No items in this category</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      item.isPurchased
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 hover:border-emerald-500 bg-white"
                    }`}
                  >
                    {item.isPurchased && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <span
                      className={`text-xs font-bold ${
                        item.isPurchased ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2 font-medium">
                      {item.amount}
                    </span>
                    {item.isCustom && (
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded ml-2">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </Card>
      </main>

      {/* Add Custom Item Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Custom Grocery Item"
        subtitle="Add any household staple or ingredient to your shopping list."
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Item Name</label>
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Greek Yogurt, Himalayan Pink Salt..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity / Amount
              </label>
              <input
                type="text"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="e.g. 500g, 1 pack"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as GroceryCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="protein">Protein</option>
                <option value="dairy">Dairy</option>
                <option value="pantry">Pantry</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-xs">
              Add to List
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <MobileNav />
      <Footer />
    </div>
  );
}
