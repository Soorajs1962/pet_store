export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  stock: number;
  discount?: number; // percentage discount (e.g. 15 for 15% off)
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  title: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role?: "customer" | "staff" | "admin";
  addresses: Array<{
    id: string;
    isDefault: boolean;
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
  }>;
  savedCards: Array<{
    id: string;
    brand: string;
    last4: string;
    expiry: string;
  }>;
}
