"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Product, CartItem, UserProfile } from "@/lib/types";
import { productService, userService } from "@/lib/services/storeService";

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  user: UserProfile | null;
  recentlyViewed: Product[];
  toasts: Toast[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: number) => void;
  updateProfile: (profile: UserProfile) => void;
  refreshProducts: () => void;
  trackProductView: (productId: string) => void;
  login: (username: string) => Promise<boolean>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Sync client-side state on mount
  useEffect(() => {
    setProducts(productService.getProducts());
    setRecentlyViewed(productService.getRecentlyViewed());

    const storedCart = localStorage.getItem("premium_petshop_cart");
    if (storedCart) {
      try { setCart(JSON.parse(storedCart)); } catch { setCart([]); }
    }

    const storedWishlist = localStorage.getItem("premium_petshop_wishlist");
    if (storedWishlist) {
      try { setWishlist(JSON.parse(storedWishlist)); } catch { setWishlist([]); }
    }

    setHydrated(true);
  }, []);

  // Sync NextAuth session with AppContext user profile
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const email = session.user.email || "";
      const isOwner = email === "admin@aurapet.com";
      
      setUser({
        name: session.user.name || (isOwner ? "Store Administrator" : "Customer"),
        email: email,
        avatar: (session.user as any).avatar || session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        phone: (session.user as any).phone || (isOwner ? "+91 99999 99999" : "+91 98765 43210"),
        addresses: [
          {
            id: "addr-1",
            isDefault: true,
            fullName: session.user.name || "Customer",
            addressLine1: "Flat 402, Block B, Prestige Heights, Indiranagar",
            city: "Bengaluru, Karnataka",
            postalCode: "560038",
            country: "India"
          }
        ],
        savedCards: []
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status]);

  // Sync cart to localstorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("premium_petshop_cart", JSON.stringify(cart));
    }
  }, [cart, hydrated]);

  // Sync wishlist to localstorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("premium_petshop_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, hydrated]);

  const refreshProducts = () => {
    setProducts(productService.getProducts());
  };

  const addToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const availableStock = product.stock;
    if (availableStock <= 0) {
      addToast(`${product.name} is out of stock!`, "error");
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      
      if (existingIndex > -1) {
        const existingItem = prevCart[existingIndex];
        const newQty = existingItem.quantity + quantity;
        
        if (newQty > availableStock) {
          addToast(`Only ${availableStock} units of ${product.name} available.`, "error");
          return prevCart;
        }

        const newCart = [...prevCart];
        newCart[existingIndex] = { ...existingItem, quantity: newQty };
        addToast(`Updated ${product.name} quantity in cart!`, "success");
        return newCart;
      }

      if (quantity > availableStock) {
        addToast(`Only ${availableStock} units of ${product.name} available.`, "error");
        return prevCart;
      }

      addToast(`Added ${product.name} to cart!`, "success");
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(c => c.product.id === productId);
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
    if (item) {
      addToast(`Removed ${item.product.name} from cart.`, "info");
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.find(c => c.product.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity > item.product.stock) {
      addToast(`Cannot add more than ${item.product.stock} units.`, "error");
      return;
    }

    setCart((prev) =>
      prev.map((c) => (c.product.id === productId ? { ...c, quantity } : c))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const productsList = productService.getProducts();
    const prod = productsList.find(p => p.id === productId);
    if (!prod) return;

    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addToast(`Removed ${prod.name} from wishlist.`, "info");
        return prev.filter((id) => id !== productId);
      } else {
        addToast(`Added ${prod.name} to wishlist!`, "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const updateProfile = (newProfile: UserProfile) => {
    setUser(newProfile);
    userService.updateProfile(newProfile);
    addToast("Profile updated successfully!", "success");
  };

  const trackProductView = (productId: string) => {
    productService.addRecentlyViewed(productId);
    setRecentlyViewed(productService.getRecentlyViewed());
  };

  const login = async (username: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        username,
        password: "password",
        redirect: false
      });
      if (result?.error) {
        addToast("Authentication failed.", "error");
        return false;
      }
      addToast("Signed in successfully!", "success");
      return true;
    } catch {
      addToast("An error occurred during sign-in.", "error");
      return false;
    }
  };

  const googleLogin = async () => {
    try {
      await signIn("google");
    } catch {
      addToast("Failed to initialize Google login.", "error");
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    addToast("Signed out successfully.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        recentlyViewed,
        toasts,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addToast,
        removeToast,
        updateProfile,
        refreshProducts,
        trackProductView,
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
