export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  price: number;
  old_price: number | null;
  category: string;
  tags: string[];
  thumbnail: string;
  images: string[];
  preview_video: string | null;
  demo_url: string | null;
  zip_file: string | null;
  sales: number;
  views: number;
  rating: number;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  payment_method: "paypal" | "vodafone_cash";
  payment_status: "pending" | "paid" | "failed";
  transaction_id: string | null;
  order_status: "pending" | "approved" | "rejected";
  created_at: string;
  product?: Product;
  user?: User;
}

export interface Download {
  id: string;
  user_id: string;
  product_id: string;
  download_count: number;
  expires_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: "order" | "system" | "review" | "download";
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}
