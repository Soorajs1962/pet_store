"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { productService, orderService } from "@/lib/services/storeService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import CartDrawer from "@/components/CartDrawer";
import { Product } from "@/lib/types";
import { User, Heart, ShoppingBag, Sliders, Plus, Trash2, Check, AlertTriangle, AlertCircle, LogOut } from "lucide-react";

function AccountContent() {
  const { user, updateProfile, wishlist, products, refreshProducts, addToast, logout } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync tab with query parameters
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "wishlist", "orders", "admin"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Auth Redirect Gate
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/account");
    }
  }, [user, router]);

  // Edit Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  // Sync form when user state mounts/changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-secondary font-light animate-pulse">Redirecting to login...</span>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...user,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const pastOrders = orderService.getOrders();
  const isAdmin = user.email === "admin@aurapet.com";

  // If normal user tries to access /account?tab=admin, kick them to profile tab
  if (activeTab === "admin" && !isAdmin) {
    setActiveTab("profile");
  }

  // ----------------------------------------------------
  // ADMIN PANEL STATE & ACTIONS
  // ----------------------------------------------------
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "Beds",
    price: 0,
    stock: 10,
    image: "",
    description: "",
    material: "",
    origin: ""
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.image) {
      addToast("Product name and image URL are required.", "error");
      return;
    }

    productService.addProduct({
      name: newProductForm.name,
      category: newProductForm.category,
      price: Number(newProductForm.price),
      stock: Number(newProductForm.stock),
      image: newProductForm.image,
      images: [newProductForm.image],
      description: newProductForm.description || "Premium pet supply designed for modern style.",
      specifications: {
        "Material": newProductForm.material || "Standard wood/cotton blend",
        "Origin": newProductForm.origin || "Designed in Denmark"
      },
      isNew: true
    });

    addToast(`Successfully created ${newProductForm.name}!`, "success");
    refreshProducts();
    setNewProductForm({
      name: "",
      category: "Beds",
      price: 0,
      stock: 10,
      image: "",
      description: "",
      material: "",
      origin: ""
    });
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      productService.updateProduct({ ...prod, stock: newStock });
      refreshProducts();
      addToast("Inventory updated.", "success");
    }
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      productService.updateProduct({ ...prod, price: newPrice });
      refreshProducts();
      addToast("Price updated.", "success");
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod && confirm(`Are you sure you want to delete ${prod.name}?`)) {
      productService.deleteProduct(productId);
      refreshProducts();
      addToast("Product deleted.", "info");
    }
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 bg-background pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 bg-white border border-border-brand rounded-2xl p-6 h-fit shadow-sm space-y-2">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-brand">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border-brand">
                  <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary leading-tight truncate max-w-[150px]">{user.name}</h4>
                  <span className="text-xs text-secondary font-light">
                    {isAdmin ? "Store Owner" : "Loyal Member"}
                  </span>
                </div>
              </div>

              {/* Account Tabs */}
              {[
                { id: "profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
                { id: "wishlist", label: "Wishlist Collection", icon: <Heart className="w-4 h-4" /> },
                { id: "orders", label: "Purchase History", icon: <ShoppingBag className="w-4 h-4" /> },
                ...(isAdmin ? [{ id: "admin", label: "Store Admin Panel", icon: <Sliders className="w-4 h-4" /> }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary text-white font-semibold shadow-sm"
                      : "text-secondary hover:bg-background hover:text-primary"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-sm py-2.5 px-4 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer border-t border-border-brand mt-4 pt-4"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

            {/* Main Workspace */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                /* PROFILE TAB */
                <div className="bg-white border border-border-brand rounded-3xl p-8 shadow-sm space-y-8 animate-fade-in">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-primary border-b border-border-brand pb-4 mb-6">
                      Personal Details
                    </h3>
                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Display Name</label>
                        <input
                          type="text"
                          required
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2 pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-full bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Save Profile Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Addresses */}
                  <div>
                    <h3 className="font-sans font-bold text-base text-primary border-b border-border-brand pb-4 mb-4">
                      Saved Addresses
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.addresses.map((addr) => (
                        <div key={addr.id} className="border border-border-brand rounded-2xl p-5 relative">
                          <span className="text-[10px] uppercase font-bold text-accent mb-2 block flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Default Shipping Address
                          </span>
                          <h4 className="font-bold text-sm text-primary mb-1">{addr.fullName}</h4>
                          <p className="text-xs text-secondary leading-relaxed font-light">
                            {addr.addressLine1}, {addr.city}<br />
                            {addr.postalCode}, {addr.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                /* WISHLIST TAB */
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-sans font-bold text-lg text-primary bg-white border border-border-brand rounded-2xl p-6 shadow-sm">
                    My Wishlist Collection ({wishlistProducts.length})
                  </h3>

                  {wishlistProducts.length === 0 ? (
                    <div className="bg-white border border-border-brand rounded-3xl py-16 text-center shadow-sm">
                      <Heart className="w-8 h-8 text-secondary/40 mx-auto mb-3" />
                      <h4 className="font-bold text-primary mb-2">Wishlist is empty</h4>
                      <p className="text-xs text-secondary font-light max-w-xs mx-auto">
                        Explore our store catalog and click the heart icon on products you love.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {wishlistProducts.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onQuickView={setQuickViewProduct}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                /* ORDERS TAB */
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-sans font-bold text-lg text-primary bg-white border border-border-brand rounded-2xl p-6 shadow-sm">
                    Purchase History ({pastOrders.length})
                  </h3>

                  {pastOrders.length === 0 ? (
                    <div className="bg-white border border-border-brand rounded-3xl py-16 text-center shadow-sm">
                      <ShoppingBag className="w-8 h-8 text-secondary/40 mx-auto mb-3" />
                      <h4 className="font-bold text-primary mb-2">No past orders</h4>
                      <p className="text-xs text-secondary font-light max-w-xs mx-auto">
                        Place your first order and track its shipping status here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastOrders.map((order) => (
                        <div key={order.id} className="bg-white border border-border-brand rounded-2xl p-6 shadow-sm space-y-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border-brand pb-3 gap-2">
                            <div>
                              <span className="text-xs text-secondary font-light">Order ID</span>
                              <h4 className="font-bold text-sm text-primary">#{order.id}</h4>
                            </div>
                            <div>
                              <span className="text-xs text-secondary font-light block text-left sm:text-right">Date Placed</span>
                              <span className="font-semibold text-xs text-primary">{order.date}</span>
                            </div>
                            <div>
                              <span className="text-xs text-secondary font-light block text-left sm:text-right">Status</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-sans text-[10px] font-bold uppercase tracking-wider block">
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.product.id} className="flex justify-between items-center text-xs">
                                <span className="text-secondary font-light">
                                  {item.quantity}x {item.product.name}
                                </span>
                                <span className="font-semibold text-primary">
                                  ₹{(item.product.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-border-brand pt-3 flex justify-between items-center text-sm font-bold text-primary">
                            <span>Total Billed</span>
                            <span>₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "admin" && isAdmin && (
                /* ADMIN/INVENTORY TAB */
                <div className="space-y-8 animate-fade-in">
                  {/* Stock Alerts Card */}
                  <div className="bg-white border border-border-brand rounded-3xl p-6 shadow-sm">
                    <h3 className="font-sans font-bold text-base text-primary mb-4 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-accent" /> Stock Monitor & Alerts
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {products.filter(p => p.stock <= 8).length === 0 ? (
                        <div className="sm:col-span-2 border border-accent/20 bg-accent/5 p-4 rounded-xl flex items-center gap-3 text-xs text-accent">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>All products are well stocked! No shortages detected.</span>
                        </div>
                      ) : (
                        products.filter(p => p.stock <= 8).map(p => (
                          <div
                            key={p.id}
                            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                              p.stock === 0
                                ? "bg-red-50/70 border-red-200 text-red-700"
                                : "bg-amber-50/70 border-amber-200 text-amber-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {p.stock === 0 ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                              <div>
                                <span className="font-bold block truncate max-w-[150px]">{p.name}</span>
                                <span>Status: {p.stock === 0 ? "Out of Stock" : `${p.stock} units left`}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleUpdateStock(p.id, 25)}
                              className="px-3 py-1 bg-white hover:bg-primary hover:text-white border border-current text-xs font-bold rounded-full transition-all cursor-pointer"
                            >
                              Restock (25)
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add Product Section */}
                  <div className="bg-white border border-border-brand rounded-3xl p-6 shadow-sm">
                    <h3 className="font-sans font-bold text-base text-primary border-b border-border-brand pb-4 mb-6">
                      Add New Catalog Product
                    </h3>
                    <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Product Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Minimalist Ceramic Food Bowl"
                          value={newProductForm.name}
                          onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Category</label>
                        <select
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 outline-none bg-transparent"
                        >
                          {["Beds", "Accessories", "Food", "Treats", "Toys", "Health"].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Price (₹)</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Initial Stock</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={newProductForm.stock}
                          onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Material Specification</label>
                        <input
                          type="text"
                          placeholder="e.g. Organic Cotton Linen"
                          value={newProductForm.material}
                          onChange={(e) => setNewProductForm({ ...newProductForm, material: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Image Unsplash URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={newProductForm.image}
                          onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Description</label>
                        <textarea
                          placeholder="Add premium product specifications and copy here..."
                          value={newProductForm.description}
                          onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-2xl p-4 outline-none h-24 resize-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-primary hover:bg-accent text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
                        >
                          Publish to Catalog
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Complete Catalog List */}
                  <div className="bg-white border border-border-brand rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="font-sans font-bold text-base text-primary border-b border-border-brand pb-4">
                      Complete Product Catalog ({products.length} Items)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border-brand font-bold text-secondary">
                            <th className="py-3 pr-2">ID</th>
                            <th className="py-3">Name</th>
                            <th className="py-3">Category</th>
                            <th className="py-3">Price</th>
                            <th className="py-3">Stock Level</th>
                            <th className="py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p.id} className="border-b border-border-brand last:border-b-0 hover:bg-background/40">
                              <td className="py-3 text-secondary pr-2 font-mono">{p.id}</td>
                              <td className="py-3 font-semibold text-primary truncate max-w-[150px]">{p.name}</td>
                              <td className="py-3 text-secondary">{p.category}</td>
                              <td className="py-3">
                                <input
                                  type="number"
                                  value={p.price}
                                  onChange={(e) => handleUpdatePrice(p.id, Number(e.target.value))}
                                  className="w-16 border border-border-brand rounded px-1.5 py-0.5 text-center font-bold"
                                />
                              </td>
                              <td className="py-3">
                                <input
                                  type="number"
                                  value={p.stock}
                                  onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                                  className={`w-16 border rounded px-1.5 py-0.5 text-center font-semibold ${
                                    p.stock === 0 ? "border-red-300 bg-red-50" : "border-border-brand"
                                  }`}
                                />
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="text-secondary hover:text-red-500 transition-colors p-1 cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

export default function Account() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-secondary font-light animate-pulse">Loading Account Workspace...</span>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
