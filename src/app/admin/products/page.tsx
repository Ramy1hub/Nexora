"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Link as LinkIcon,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  old_price: number | null;
  category: string;
  thumbnail: string;
  demo_url: string | null;
  sales: number;
  rating: number;
  features: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: 0,
    old_price: 0,
    category: "templates",
    thumbnail: "",
    demo_url: "",
  });

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        title: product.title,
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        old_price: product.old_price || 0,
        category: product.category,
        thumbnail: product.thumbnail || "",
        demo_url: product.demo_url || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        slug: "",
        description: "",
        price: 0,
        old_price: 0,
        category: "templates",
        thumbnail: "",
        demo_url: "",
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createClient();

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      price: formData.price,
      old_price: formData.old_price > 0 ? formData.old_price : null,
      category: formData.category,
      thumbnail: formData.thumbnail,
      demo_url: formData.demo_url,
    };

    let error;

    if (editingId) {
      const { error: updateErr } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);
      error = updateErr;
    } else {
      const { error: insertErr } = await supabase
        .from("products")
        .insert([payload]);
      error = insertErr;
    }

    if (error) {
      toast.error(error.message || "Failed to save product");
    } else {
      toast.success(`Product ${editingId ? "updated" : "added"} successfully`);
      setShowModal(false);
      fetchProducts();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    
    if (error) {
      toast.error(error.message || "Failed to delete product");
    } else {
      toast.success("Product deleted successfully");
      setProducts(products.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} products total
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or slug..."
          className="input-field pl-9"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-slate-800/50">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Sales</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon size={20} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[200px]">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold capitalize">
                        {product.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      ${product.price}
                      {product.old_price && (
                        <span className="text-gray-400 line-through ml-1.5 text-xs">
                          ${product.old_price}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {product.sales}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      ⭐ {product.rating}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-500 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50 p-6 glass-card rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <AlertTriangle size={24} />
                <h3 className="font-bold text-lg">Delete Product?</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors py-2"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
              onClick={() => setShowModal(false)}
            >
              <div className="min-h-screen px-4 text-center">
                <div className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform glass-card rounded-2xl shadow-xl relative"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {editingId ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              title: e.target.value,
                              slug: editingId ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
                            });
                          }}
                          className="input-field"
                          placeholder="e.g. Nova Dashboard"
                        />
                      </div>
                      
                      {/* Slug */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Slug
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="input-field"
                          placeholder="nova-dashboard"
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Price ($)
                        </label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          className="input-field"
                        />
                      </div>

                      {/* Old Price */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Old Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.old_price}
                          onChange={(e) => setFormData({ ...formData, old_price: parseFloat(e.target.value) || 0 })}
                          className="input-field"
                          placeholder="Optional"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="input-field appearance-none bg-white dark:bg-slate-900"
                        >
                          <option value="websites">Websites</option>
                          <option value="landing-pages">Landing Pages</option>
                          <option value="dashboards">Dashboards</option>
                          <option value="templates">Templates</option>
                          <option value="scripts">Scripts</option>
                          <option value="html5-games">HTML5 Games</option>
                          <option value="ui-kits">UI Kits</option>
                          <option value="web-tools">Web Tools</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="input-field resize-none"
                        />
                      </div>

                      {/* Thumbnail URL */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Thumbnail URL
                        </label>
                        <div className="relative">
                          <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="url"
                            value={formData.thumbnail}
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            className="input-field pl-9"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                      </div>

                      {/* Demo URL */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Demo URL (Live Preview)
                        </label>
                        <div className="relative">
                          <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="url"
                            value={formData.demo_url}
                            onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                            className="input-field pl-9"
                            placeholder="https://demo.example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3 justify-end border-t border-gray-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-5 py-2.5 btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 btn-primary flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Save size={18} />
                            {editingId ? "Update Product" : "Save Product"}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
