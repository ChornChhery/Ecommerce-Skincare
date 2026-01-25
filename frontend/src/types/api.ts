// User Registration Data
export interface RegisterUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  skin_type?: string;
  language?: string;
  date_of_birth?: string;
  gender?: string;
  profile_image_url?: string;
}

// Product Data for Creation/Updates (matches mock data structure)
export interface ProductData {
  name_en: string;
  price: number;
  category: string;
  image_url: string;
  description_en: string;
  stock: number;
  status: string;
  skin_type: string;
  created_at: string;
}

// Coupon Data for Creation/Updates (matches mock data structure)
export interface CouponData {
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  created_at: string;
  applicableCategories: string[];
  isFirstTimeOnly: boolean;
}

// Generic Update Data (for bulk operations)
export interface UpdateData {
  [key: string]: unknown; // Allow flexible updates while maintaining type safety
}

// Note: Interfaces are defined locally above since they're not exported from component files