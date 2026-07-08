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

  

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
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

  // Address Manager Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    postalCode: "",
    country: "India",
    isDefault: false
  });

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let updatedAddresses = [...user.addresses];

    if (editingAddressId) {
      // Editing existing address
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === editingAddressId
          ? { ...addr, ...addressForm }
          : addressForm.isDefault ? { ...addr, isDefault: false } : addr
      );
      addToast("Address updated.", "success");
    } else {
      // Creating new address
      const newAddress = {
        id: `addr-${Date.now()}`,
        ...addressForm
      };
      
      if (addressForm.isDefault || updatedAddresses.length === 0) {
        newAddress.isDefault = true;
        updatedAddresses = updatedAddresses.map((addr) => ({ ...addr, isDefault: false }));
      }
      updatedAddresses.push(newAddress);
      addToast("Address added.", "success");
    }

    updateProfile({
      ...user,
      addresses: updatedAddresses
    });

    // Reset form
    setAddressForm({
      fullName: "",
      addressLine1: "",
      city: "",
      postalCode: "",
      country: "India",
      isDefault: false
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleEditAddressClick = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      addressLine1: addr.addressLine1,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: addr.isDefault
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (!user) return;
    if (confirm("Delete this address?")) {
      const updatedAddresses = user.addresses.filter((addr) => addr.id !== id);
      // Ensure at least one address is default if any left
      if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }
      updateProfile({
        ...user,
        addresses: updatedAddresses
      });
      addToast("Address deleted.", "info");
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id
    }));
    updateProfile({
      ...user,
      addresses: updatedAddresses
    });
    addToast("Default address updated.", "success");
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const pastOrders = orderService.getOrders(user?.email);
  const isAdmin = user?.email === "admin@aurapet.com" || user?.role === "admin";
  const isStaff = user?.email === "staff@aurapet.com" || user?.role === "staff";
  const isStaffOrAdmin = isAdmin || isStaff;

  // If normal user tries to access /account?tab=admin, kick them to profile tab
  if (activeTab === "admin" && !isStaffOrAdmin) {
    setActiveTab("profile");
  }

  // Admin panel subtab: "products" | "team"
  const [adminSubTab, setAdminSubTab] = useState("products");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    role: "staff"
  });

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch("/api/auth/team");
      const data = await res.json();
      if (data.success) {
        setTeamMembers(data.team);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (activeTab === "admin") {
      fetchTeamMembers();
    }
  }, [activeTab]);

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamForm)
      });
      const data = await res.json();
      if (data.success) {
        addToast("Team member updated successfully.", "success");
        fetchTeamMembers();
        setShowTeamForm(false);
        setTeamForm({
          name: "",
          username: "",
          phone: "",
          password: "",
          role: "staff"
        });
      } else {
        addToast(data.error || "Failed to update member.", "error");
      }
    } catch {
      addToast("Connection error.", "error");
    }
  };

  const handleDeleteTeamMember = async (username: string) => {
    if (username.toLowerCase() === "admin@aurapet.com" || username.toLowerCase() === "staff@aurapet.com") {
      addToast("Cannot delete default seeded team members.", "error");
      return;
    }
    if (confirm(`Remove ${username} from team?`)) {
      try {
        const res = await fetch("/api/auth/team", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (data.success) {
          addToast("Member removed from team.", "info");
          fetchTeamMembers();
        }
      } catch {
        addToast("Connection error.", "error");
      }
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-secondary font-light animate-pulse">Redirecting to login...</span>
      </div>
    );
  }

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
                    {isAdmin ? "Store Owner" : isStaff ? "Store Staff" : "Loyal Member"}
                  </span>
                </div>
              </div>

              {/* Account Tabs */}
              {[
                { id: "profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
                { id: "wishlist", label: "Wishlist Collection", icon: <Heart className="w-4 h-4" /> },
                { id: "orders", label: "Purchase History", icon: <ShoppingBag className="w-4 h-4" /> },
                ...((isAdmin || isStaff) ? [{ id: "admin", label: "Store Admin Panel", icon: <Sliders className="w-4 h-4" /> }] : [])
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
                    <div className="flex items-center justify-between border-b border-border-brand pb-4 mb-4">
                      <h3 className="font-sans font-bold text-base text-primary">
                        Saved Addresses
                      </h3>
                      {!showAddressForm && (
                        <button
                          onClick={() => {
                            setEditingAddressId(null);
                            setAddressForm({
                              fullName: "",
                              addressLine1: "",
                              city: "",
                              postalCode: "",
                              country: "India",
                              isDefault: false
                            });
                            setShowAddressForm(true);
                          }}
                          className="px-4 py-2 bg-primary hover:bg-secondary text-white text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center gap-1.5 animate-fade-in"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Address
                        </button>
                      )}
                    </div>

                    {showAddressForm && (
                      <form onSubmit={handleSaveAddress} className="bg-background rounded-2xl p-6 border border-border-brand mb-6 space-y-4 animate-fade-in">
                        <h4 className="font-bold text-sm text-primary mb-2">
                          {editingAddressId ? "Edit Address Details" : "Add Shipping Address"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1.5">Recipient Full Name</label>
                            <input
                              type="text"
                              required
                              value={addressForm.fullName}
                              onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 bg-white text-primary outline-none focus:border-primary font-medium"
                              placeholder="e.g. Vikram Malhotra"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1.5">Address Line 1</label>
                            <input
                              type="text"
                              required
                              value={addressForm.addressLine1}
                              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 bg-white text-primary outline-none focus:border-primary font-medium"
                              placeholder="Flat/House No, Building, Street"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1.5">City & State</label>
                            <input
                              type="text"
                              required
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 bg-white text-primary outline-none focus:border-primary font-medium"
                              placeholder="e.g. Bengaluru, Karnataka"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1.5">Postal Code</label>
                            <input
                              type="text"
                              required
                              value={addressForm.postalCode}
                              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 bg-white text-primary outline-none focus:border-primary font-medium"
                              placeholder="e.g. 560038"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1.5">Country</label>
                            <input
                              type="text"
                              required
                              value={addressForm.country}
                              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 bg-white text-primary outline-none focus:border-primary font-medium"
                              placeholder="e.g. India"
                            />
                          </div>
                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 text-xs text-primary font-medium cursor-pointer">
                              <input
                                type="checkbox"
                                checked={addressForm.isDefault}
                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                className="accent-primary"
                              />
                              Set as default shipping address
                            </label>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-5 py-2 border border-border-brand hover:bg-white text-primary text-xs font-bold rounded-full transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-primary hover:bg-secondary text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    )}

                    {user.addresses.length === 0 ? (
                      <div className="border border-dashed border-border-brand rounded-2xl p-8 text-center bg-white/50">
                        <span className="text-xs text-secondary font-light block mb-1">No saved addresses found.</span>
                        <span className="text-[10px] text-secondary/60 font-light block">Please add a shipping address to proceed with checkouts.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user.addresses.map((addr) => (
                          <div key={addr.id} className="border border-border-brand rounded-2xl p-5 relative flex flex-col justify-between bg-white shadow-sm hover:border-primary transition-all">
                            <div>
                              {addr.isDefault ? (
                                <span className="text-[9px] uppercase font-bold text-accent mb-2.5 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Default Shipping Address
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[9px] uppercase font-bold text-secondary/60 hover:text-primary mb-2.5 block cursor-pointer transition-colors"
                                >
                                  Make Default
                                </button>
                              )}
                              <h4 className="font-bold text-sm text-primary mb-1">{addr.fullName}</h4>
                              <p className="text-xs text-secondary leading-relaxed font-light">
                                {addr.addressLine1}, {addr.city}<br />
                                {addr.postalCode}, {addr.country}
                              </p>
                            </div>
                            <div className="flex justify-end gap-2 border-t border-border-brand pt-3 mt-4">
                              <button
                                onClick={() => handleEditAddressClick(addr)}
                                className="text-xs text-primary hover:underline font-bold cursor-pointer"
                              >
                                Edit
                              </button>
                              <span className="text-secondary/30">|</span>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

              {activeTab === "admin" && isStaffOrAdmin && (
                /* ADMIN/INVENTORY TAB */
                <div className="space-y-8 animate-fade-in">
                  {/* Admin Sub-Tabs */}
                  <div className="flex border-b border-border-brand mb-6 gap-6">
                    <button
                      onClick={() => setAdminSubTab("products")}
                      className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                        adminSubTab === "products"
                          ? "border-primary text-primary"
                          : "border-transparent text-secondary hover:text-primary"
                      }`}
                    >
                      Catalog & Inventory
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => setAdminSubTab("team")}
                        className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                          adminSubTab === "team"
                            ? "border-primary text-primary"
                            : "border-transparent text-secondary hover:text-primary"
                        }`}
                      >
                        Team & Roles
                      </button>
                    )}
                  </div>

                  {adminSubTab === "products" && (
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
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Category</label>
                            <select
                              value={newProductForm.category}
                              onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none bg-transparent font-medium text-primary focus:border-primary"
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
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
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
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Material Specification</label>
                            <input
                              type="text"
                              placeholder="e.g. Organic Cotton Linen"
                              value={newProductForm.material}
                              onChange={(e) => setNewProductForm({ ...newProductForm, material: e.target.value })}
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
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
                              className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Description</label>
                            <textarea
                              placeholder="Add premium product specifications and copy here..."
                              value={newProductForm.description}
                              onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                              className="w-full text-xs border border-border-brand rounded-2xl p-4 outline-none h-24 resize-none font-medium text-primary focus:border-primary"
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
                                      className="w-16 border border-border-brand rounded px-1.5 py-0.5 text-center font-bold text-primary"
                                    />
                                  </td>
                                  <td className="py-3">
                                    <input
                                      type="number"
                                      value={p.stock}
                                      onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                                      className={`w-16 border rounded px-1.5 py-0.5 text-center font-semibold text-primary ${
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

                  {adminSubTab === "team" && isAdmin && (
                    <div className="space-y-8 animate-fade-in">
                      {/* Add Team Member Section */}
                      <div className="flex items-center justify-between bg-white border border-border-brand rounded-3xl p-6 shadow-sm">
                        <div>
                          <h3 className="font-sans font-bold text-base text-primary">Team Management</h3>
                          <p className="text-xs text-secondary font-light">Add store staff or additional administrators to manage the backend operations.</p>
                        </div>
                        {!showTeamForm && (
                          <button
                            onClick={() => {
                              setShowTeamForm(true);
                              setTeamForm({
                                name: "",
                                username: "",
                                phone: "",
                                password: "",
                                role: "staff"
                              });
                            }}
                            className="px-5 py-2 bg-primary hover:bg-secondary text-white text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Member
                          </button>
                        )}
                      </div>

                      {showTeamForm && (
                        <div className="bg-white border border-border-brand rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
                          <h4 className="font-bold text-sm text-primary">Create Team Account</h4>
                          <form onSubmit={handleSaveTeamMember} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Member Name</label>
                              <input
                                type="text"
                                required
                                value={teamForm.name}
                                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
                                placeholder="e.g. Priyanjali Sen"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Email Address</label>
                              <input
                                type="email"
                                required
                                value={teamForm.username}
                                onChange={(e) => setTeamForm({ ...teamForm, username: e.target.value })}
                                className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
                                placeholder="e.g. staff@aurapet.com"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Phone Number</label>
                              <input
                                type="text"
                                value={teamForm.phone}
                                onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                                className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
                                placeholder="e.g. 9876543210"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Initial Password</label>
                              <input
                                type="password"
                                required
                                value={teamForm.password}
                                onChange={(e) => setTeamForm({ ...teamForm, password: e.target.value })}
                                className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none font-medium text-primary focus:border-primary"
                                placeholder="Password"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Access Role</label>
                              <select
                                value={teamForm.role}
                                onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                                className="w-full text-xs border border-border-brand rounded-full px-4 py-2.5 outline-none bg-transparent font-medium text-primary focus:border-primary"
                              >
                                <option value="staff">Staff Member (Catalog management only)</option>
                                <option value="admin">Administrator (Full admin board accesses)</option>
                              </select>
                            </div>
                            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setShowTeamForm(false)}
                                className="px-5 py-2 border border-border-brand hover:bg-white text-primary text-xs font-bold rounded-full transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-2 bg-primary hover:bg-secondary text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
                              >
                                Save Member
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Team Members List */}
                      <div className="bg-white border border-border-brand rounded-3xl p-6 shadow-sm space-y-4">
                        <h3 className="font-sans font-bold text-base text-primary border-b border-border-brand pb-4">
                          Active Store Team ({teamMembers.length} Accounts)
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-border-brand font-bold text-secondary">
                                <th className="py-3">Name</th>
                                <th className="py-3">Email/Username</th>
                                <th className="py-3">Phone</th>
                                <th className="py-3">Role</th>
                                <th className="py-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {teamMembers.map((member: any) => (
                                <tr key={member.username} className="border-b border-border-brand last:border-b-0 hover:bg-background/40">
                                  <td className="py-3 font-semibold text-primary">{member.name}</td>
                                  <td className="py-3 text-secondary font-mono">{member.username}</td>
                                  <td className="py-3 text-secondary">{member.phone || "—"}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                                      member.role === "admin"
                                        ? "bg-accent/10 text-accent border border-accent/20"
                                        : "bg-blue-50 text-blue-600 border border-blue-100"
                                    }`}>
                                      {member.role}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right">
                                    {member.username.toLowerCase() !== "admin@aurapet.com" && member.username.toLowerCase() !== "staff@aurapet.com" ? (
                                      <button
                                        onClick={() => handleDeleteTeamMember(member.username)}
                                        className="text-secondary hover:text-red-500 transition-colors p-1 cursor-pointer"
                                        title="Remove Member"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-secondary/40 select-none pr-1">System Account</span>
                                    )}
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
