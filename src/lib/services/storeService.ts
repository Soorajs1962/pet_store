import { Product, Order, UserProfile, BlogPost } from "../types";
import { INITIAL_PRODUCTS, MOCK_BLOGS } from "../data/mockProducts";

const PRODUCTS_KEY = "premium_petshop_products";
const ORDERS_KEY = "premium_petshop_orders";
const PROFILE_KEY = "premium_petshop_profile";
const RECENTLY_VIEWED_KEY = "premium_petshop_recently_viewed";

// Helper to check if window/localStorage is available
const isClient = typeof window !== "undefined";

const defaultProfile: UserProfile = {
  name: "Alexander Mercer",
  email: "alexander@mercer.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  phone: "+91 98765 43210",
  addresses: [
    {
      id: "addr-1",
      isDefault: true,
      fullName: "Alexander Mercer",
      addressLine1: "Flat 402, Block B, Prestige Heights, Indiranagar",
      city: "Bengaluru, Karnataka",
      postalCode: "560038",
      country: "India"
    }
  ],
  savedCards: [
    {
      id: "card-1",
      brand: "Visa",
      last4: "4242",
      expiry: "12/28"
    }
  ]
};

// ----------------------------------------------------
// PRODUCT SERVICE
// ----------------------------------------------------
export const productService = {
  getProducts(): Product[] {
    if (!isClient) return INITIAL_PRODUCTS;
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored || stored.includes("photo-1541599540903-216a46ca1df0")) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  saveProducts(products: Product[]): void {
    if (isClient) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  },

  addProduct(newProduct: Omit<Product, "id" | "rating" | "reviewsCount"> & { id?: string }): Product {
    const products = this.getProducts();
    const product: Product = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0
    };
    products.push(product);
    this.saveProducts(products);
    return product;
  },

  updateProduct(updated: Product): void {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === updated.id);
    if (idx !== -1) {
      products[idx] = updated;
      this.saveProducts(products);
    }
  },

  deleteProduct(id: string): void {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    this.saveProducts(filtered);
  },

  decrementStock(productId: string, quantity: number): boolean {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      const p = products[idx];
      if (p.stock >= quantity) {
        p.stock -= quantity;
        products[idx] = p;
        this.saveProducts(products);
        return true;
      }
    }
    return false;
  },

  restockProduct(productId: string, quantity: number): void {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      products[idx].stock += quantity;
      this.saveProducts(products);
    }
  },

  getRecentlyViewed(): Product[] {
    if (!isClient) return [];
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!stored) return [];
    try {
      const ids: string[] = JSON.parse(stored);
      const products = this.getProducts();
      return ids
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => !!p);
    } catch {
      return [];
    }
  },

  addRecentlyViewed(productId: string): void {
    if (!isClient) return;
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let ids: string[] = [];
    if (stored) {
      try { ids = JSON.parse(stored); } catch { ids = []; }
    }
    // Remove if already exists and prepend
    ids = ids.filter(id => id !== productId);
    ids.unshift(productId);
    // Limit to 6 recently viewed
    ids = ids.slice(0, 6);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));
  }
};

// ----------------------------------------------------
// ORDER SERVICE
// ----------------------------------------------------
export const orderService = {
  getOrders(email?: string): Order[] {
    if (!isClient) return [];
    const key = email ? `premium_petshop_orders_${email}` : ORDERS_KEY;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  createOrder(orderData: Omit<Order, "id" | "date" | "status">, email?: string): Order {
    const orders = this.getOrders(email);
    const order: Order = {
      ...orderData,
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "Processing"
    };

    // Decrement stock for all items
    orderData.items.forEach(item => {
      productService.decrementStock(item.product.id, item.quantity);
    });

    orders.unshift(order);
    if (isClient) {
      const key = email ? `premium_petshop_orders_${email}` : ORDERS_KEY;
      localStorage.setItem(key, JSON.stringify(orders));
    }
    return order;
  }
};

// ----------------------------------------------------
// USER/PROFILE SERVICE
// ----------------------------------------------------
export const userService = {
  getProfile(): UserProfile {
    if (!isClient) return defaultProfile;
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return defaultProfile;
    }
  },

  updateProfile(profile: UserProfile): void {
    if (isClient) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }
};

// ----------------------------------------------------
// BLOG SERVICE
// ----------------------------------------------------
export const blogService = {
  getBlogs(): BlogPost[] {
    return MOCK_BLOGS;
  },

  getBlogById(id: string): BlogPost | undefined {
    return MOCK_BLOGS.find(b => b.id === id);
  }
};
