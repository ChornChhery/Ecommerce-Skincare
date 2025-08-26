const MOCK_DELAY = 500; // Simulate network delay

export const mockProducts = [
  {
    id: 1,
    name_en: "Gentle Cleanser",
    price: 25.99,
    category: "cleanser",
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&h=300",
    description_en: "A gentle cleanser suitable for all skin types. This pH-balanced formula effectively removes impurities while maintaining skin's natural moisture barrier.",
    stock: 45,
    status: "active",
    skin_type: "all",
    created_at: "2024-01-15"
  },
  {
    id: 2,
    name_en: "Hydrating Moisturizer",
    price: 35.99,
    category: "moisturizer",
    image_url: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=300&h=300",
    description_en: "Lightweight moisturizer that provides deep hydration without clogging pores. Enriched with hyaluronic acid and vitamin E for a radiant complexion.",
    stock: 32,
    status: "active",
    skin_type: "dry",
    created_at: "2024-01-20"
  },
  {
    id: 3,
    name_en: "Vitamin C Serum",
    price: 45.99,
    category: "serum",
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&h=300",
    description_en: "Brightening serum with 20% vitamin C to reduce dark spots and improve skin tone. Contains antioxidants to protect against environmental damage.",
    stock: 28,
    status: "active",
    skin_type: "all",
    created_at: "2024-01-25"
  },
  {
    id: 4,
    name_en: "Retinol",
    price: 5.99,
    category: "medicine",
    image_url: "https://berichthailand.com/images/product/other/Acnetin-A_0025__10g_800x800.jpg",
    description_en: "Retinol is a vitamin A derivative that helps to reduce the appearance of fine lines and wrinkles, improve skin texture, and promote cell turnover. It is commonly used in anti-aging skincare products.",
    stock: 15,
    status: "active",
    skin_type: "all",
    created_at: "2024-02-01"
  },
  {
    id: 5,
    name_en: "Skinoren",
    price: 29.99,
    category: "medicine",
    image_url: "https://www.binsina.ae/media/catalog/product/1/2/12300_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=600&width=600&canvas=600:600",
    description_en: "Skinoren is a topical medication used to treat acne and rosacea. It contains azelaic acid, which helps to reduce inflammation, unclog pores, and kill acne-causing bacteria.",
    stock: 22,
    status: "active",
    skin_type: "acne-prone",
    created_at: "2024-02-05"
  },
  {
    id: 6,
    name_en: "Sunscreen Anessa",
    price: 39.99,
    category: "sunscreen",
    image_url: "https://princesscosmeticsqa.com/cdn/shop/files/shiseido-anessa-perfect-uv-sunscreen-skincare-milk-spf50-pa-60ml-shysydo-anysa-hlyb-alaanay-balbshr-aloaky-mn-alshms-balashaa-fok-albnfsjy-spf50-pa-60-ml-473043.jpg?v=1738160101&width=1946",
    description_en: "Anessa sunscreen is a popular Japanese sunscreen brand known for its high SPF protection and lightweight formula. It provides broad-spectrum protection against UVA and UVB rays, making it suitable for daily use.",
    stock: 38,
    status: "active",
    skin_type: "all",
    created_at: "2024-02-10"
  },
  {
    id: 7,
    name_en: "Ordinary Niacinamide",
    price: 19.99,
    category: "serum",
    image_url: "https://n.nordstrommedia.com/it/032c0fca-afb7-44a2-9a72-732cefc78538.jpeg?h=368&w=240&dpr=2",
    description_en: "The Ordinary Niacinamide 10% + Zinc 1% is a serum that helps to reduce the appearance of blemishes, control excess oil, and improve skin texture. It contains niacinamide, which is known for its anti-inflammatory properties.",
    stock: 55,
    status: "active",
    skin_type: "oily",
    created_at: "2024-02-15"
  },
  {
    id: 8,
    name_en: "Soothing Toner",
    price: 18.99,
    category: "toner",
    image_url: "https://m.media-amazon.com/images/I/611Bq4XExoL._UF1000,1000_QL80_.jpg",
    description_en: "Alcohol-free toner with calming ingredients to soothe sensitive skin and prepare it for moisturizers or serums.",
    stock: 41,
    status: "active",
    skin_type: "sensitive",
    created_at: "2024-02-20"
  },
  {
    id: 9,
    name_en: "Tea Tree Oil Spot Treatment",
    price: 14.99,
    category: "treatment",
    image_url: "https://www.jiomart.com/images/product/original/rvfx1vyfmt/youngtre-by-nature-tea-tree-oil-10ml-for-skin-hair-face-reduces-acne-promotes-blemish-free-skin-improves-hair-growth-product-images-orvfx1vyfmt-p606800558-0-202312191830.png?im=Resize=(420,420)",
    description_en: "Targeted spot treatment with natural tea tree oil to fight acne-causing bacteria and reduce redness.",
    stock: 33,
    status: "active",
    skin_type: "acne-prone",
    created_at: "2024-02-25"
  },
  {
    id: 10,
    name_en: "Aloe Vera Gel",
    price: 12.99,
    category: "moisturizer",
    image_url: "https://m.media-amazon.com/images/I/61zpo5fj6pL._UF350,350_QL80_.jpg",
    description_en: "Multi-purpose aloe vera gel that soothes sunburns, hydrates skin, and reduces irritation.",
    stock: 67,
    status: "active",
    skin_type: "all",
    created_at: "2024-03-01"
  },
  {
    id: 11,
    name_en: "Foaming Face Wash",
    price: 22.50,
    category: "cleanser",
    image_url: "https://m.media-amazon.com/images/I/61d8uQrW2hL._UF350,350_QL80_.jpg",
    description_en: "Gentle foaming cleanser that effectively removes dirt and makeup without stripping moisture.",
    stock: 29,
    status: "active",
    skin_type: "combination",
    created_at: "2024-03-05"
  },
  {
    id: 12,
    name_en: "Hyaluronic Acid Serum",
    price: 28.75,
    category: "serum",
    image_url: "https://www.madiganspharmacy.ie/wp-content/uploads/2020/07/hyalu-serum.jpg",
    description_en: "Hydrating serum packed with hyaluronic acid to plump and moisturize skin deeply.",
    stock: 44,
    status: "active",
    skin_type: "dry",
    created_at: "2024-03-10"
  },
  {
    id: 13,
    name_en: "Exfoliating Scrub",
    price: 16.99,
    category: "exfoliator",
    image_url: "https://i5.walmartimages.com/asr/5030bb99-dc5b-4e93-b116-bee61ce41393.301ed15e91d0294c7c8ec9c35f69c206.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    description_en: "Natural exfoliating scrub that removes dead skin cells and reveals smoother, brighter skin.",
    stock: 36,
    status: "active",
    skin_type: "normal",
    created_at: "2024-03-15"
  },
  {
    id: 14,
    name_en: "Charcoal Clay Mask",
    price: 21.49,
    category: "mask",
    image_url: "https://i.ebayimg.com/images/g/1p0AAOSw3YtmIOcl/s-l400.jpg",
    description_en: "Purifying clay mask with charcoal to detoxify pores and absorb excess oil.",
    stock: 19,
    status: "active",
    skin_type: "oily",
    created_at: "2024-03-20"
  },
  {
    id: 15,
    name_en: "Rose Water Mist",
    price: 17.99,
    category: "toner",
    image_url: "https://m.media-amazon.com/images/I/91YkweNjvCL._UF1000,1000_QL80_.jpg",
    description_en: "Refreshing facial mist made with rose water to hydrate and revitalize tired skin.",
    stock: 52,
    status: "active",
    skin_type: "all",
    created_at: "2024-03-25"
  },
  {
    id: 16,
    name_en: "Ceramide Moisturizer",
    price: 32.99,
    category: "moisturizer",
    image_url: "https://mintyshopaus.com/cdn/shop/files/SKIN-CERE1.jpg?v=1724668758&width=1445",
    description_en: "Rich moisturizer with ceramides to restore skin barrier and lock in hydration.",
    stock: 25,
    status: "active",
    skin_type: "dry",
    created_at: "2024-04-01"
  },
  {
    id: 17,
    name_en: "Peptide Eye Cream",
    price: 26.49,
    category: "eye cream",
    image_url: "https://beautepratique.co/cdn/shop/products/SnailEyeCream_01_720x_d8fcdd63-9779-47f0-8537-6de27c0b22f9_1024x1024.jpg?v=1663556763",
    description_en: "Nourishing eye cream with peptides to reduce dark circles, puffiness, and fine lines.",
    stock: 18,
    status: "active",
    skin_type: "all",
    created_at: "2024-04-05"
  },
  {
    id: 18,
    name_en: "Green Tea Gel Cleanser",
    price: 20.00,
    category: "cleanser",
    image_url: "https://s3.konvy.com/static/team/2024/1113/17314740795234.jpg",
    description_en: "Antioxidant-rich cleanser with green tea extract to soothe and refresh skin.",
    stock: 31,
    status: "active",
    skin_type: "sensitive",
    created_at: "2024-04-10"
  },
  {
    id: 19,
    name_en: "SPF 50 Tinted Sunscreen",
    price: 37.99,
    category: "sunscreen",
    image_url: "https://www.spectrumdermatologyseattle.com/wp-content/uploads/2024/05/La-Roche-Posay-Anthelios-Sunscreen-SPF-50-Tinted-Mineral-50ml-Carton-and-Product.webp",
    description_en: "High-protection sunscreen with tint to even skin tone and defend against sun damage.",
    stock: 42,
    status: "active",
    skin_type: "all",
    created_at: "2024-04-15"
  },
  {
    id: 20,
    name_en: "Niacinamide Cream",
    price: 24.99,
    category: "treatment",
    image_url: "https://www.koreancosmetic.cy/cdn/shop/files/GlutathioneNiacinamideFacialCreambyAPLB-1.jpg?v=1733847876",
    description_en: "Brightening cream enriched with niacinamide to minimize pores and even skin tone.",
    stock: 37,
    status: "active",
    skin_type: "combination",
    created_at: "2024-04-20"
  },
  {
    id: 21,
    name_en: "Azelaic Acid Suspension",
    price: 22.49,
    category: "treatment",
    image_url: "https://www.intomyshop.net/wp-content/uploads/2020/08/Azelaic-Acid-Suspension-1.jpg",
    description_en: "Azelaic acid helps reduce redness and improve skin clarity, great for rosacea and acne.",
    stock: 14,
    status: "active",
    skin_type: "sensitive",
    created_at: "2024-04-25"
  },
  {
    id: 22,
    name_en: "Glycolic Acid Toner",
    price: 19.75,
    category: "toner",
    image_url: "https://skinplusbd.com/public/uploads/all/cxjcun5wecf8YTqz4zIVKVa7x0vtLOQxbDku95Ab.webp",
    description_en: "Exfoliating toner with glycolic acid to remove dead skin and reveal a radiant glow.",
    stock: 46,
    status: "active",
    skin_type: "normal",
    created_at: "2024-05-01"
  },
  {
    id: 23,
    name_en: "Bakuchiol Serum",
    price: 34.90,
    category: "serum",
    image_url: "https://medias.watsons.co.th/publishing/WTCTH-316425-front-zoom.jpg?version=1740684777",
    description_en: "Natural alternative to retinol, bakuchiol helps improve texture and reduce fine lines.",
    stock: 23,
    status: "active",
    skin_type: "all",
    created_at: "2024-05-05"
  },
  {
    id: 24,
    name_en: "Centella Calming Cream",
    price: 23.95,
    category: "moisturizer",
    image_url: "https://yvescosmetic.com/upload/products/subproduct1_17052022-105612.jpeg",
    description_en: "Cream infused with Centella Asiatica to calm irritated and inflamed skin.",
    stock: 34,
    status: "active",
    skin_type: "sensitive",
    created_at: "2024-05-10"
  },
  {
    id: 25,
    name_en: "Snail Mucin Essence",
    price: 29.99,
    category: "essence",
    image_url: "https://assets.tops.co.th/CROSRX-COSRXAdvancedSnail96MucinPowerEssence100ml-8809416470009-1",
    description_en: "Hydrating essence with snail mucin to promote skin repair and improve elasticity.",
    stock: 27,
    status: "active",
    skin_type: "all",
    created_at: "2024-05-15"
  },
  {
    id: 26,
    name_en: "Collagen Firming Mask",
    price: 27.99,
    category: "mask",
    image_url: "https://th-test-11.slatic.net/p/63ba10de8018de7e46e80198451fe2a0.jpg",
    description_en: "Overnight mask with collagen to firm skin and boost elasticity while you sleep.",
    stock: 16,
    status: "active",
    skin_type: "mature",
    created_at: "2024-05-20"
  },
  {
    id: 27,
    name_en: "Cica Repair Balm",
    price: 21.99,
    category: "treatment",
    image_url: "https://m.media-amazon.com/images/I/51EBMhnaAQL.jpg",
    description_en: "Repairing balm for sensitive skin prone to redness, enriched with madecassoside.",
    stock: 39,
    status: "active",
    skin_type: "sensitive",
    created_at: "2024-05-25"
  }
];

// Mock Orders Data
export const mockOrders = [
  {
    id: 1,
    customer_name: "Sarah Johnson",
    customer_email: "sarah@example.com",
    total: 89.97,
    status: "shipped",
    created_at: "2024-07-25",
    items: [
      { product_id: 1, product_name: "Gentle Cleanser", quantity: 2, price: 25.99 },
      { product_id: 3, product_name: "Vitamin C Serum", quantity: 1, price: 45.99 }
    ]
  },
  {
    id: 2,
    customer_name: "Mike Chen",
    customer_email: "mike@example.com",
    total: 67.98,
    status: "processing",
    created_at: "2024-07-26",
    items: [
      { product_id: 2, product_name: "Hydrating Moisturizer", quantity: 1, price: 35.99 },
      { product_id: 6, product_name: "Sunscreen Anessa", quantity: 1, price: 39.99 }
    ]
  },
  {
    id: 3,
    customer_name: "Emily Davis",
    customer_email: "emily@example.com",
    total: 142.45,
    status: "delivered",
    created_at: "2024-07-24",
    items: [
      { product_id: 7, product_name: "Ordinary Niacinamide", quantity: 2, price: 19.99 },
      { product_id: 12, product_name: "Hyaluronic Acid Serum", quantity: 1, price: 28.75 },
      { product_id: 19, product_name: "SPF 50 Tinted Sunscreen", quantity: 1, price: 37.99 }
    ]
  }
];

// Mock Customers Data
export const mockCustomers = [
  {
    id: 1,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah@example.com",
    skin_type: "combination",
    total_orders: 5,
    total_spent: 245.80,
    avg_rating: 4.8,
    status: "active",
    created_at: "2024-01-15"
  },
  {
    id: 2,
    first_name: "Mike",
    last_name: "Chen",
    email: "mike@example.com",
    skin_type: "oily",
    total_orders: 3,
    total_spent: 156.90,
    avg_rating: 4.5,
    status: "active",
    created_at: "2024-02-20"
  },
  {
    id: 3,
    first_name: "Emily",
    last_name: "Davis",
    email: "emily@example.com",
    skin_type: "dry",
    total_orders: 8,
    total_spent: 389.45,
    avg_rating: 4.9,
    status: "vip",
    created_at: "2024-01-10"
  }
];

// Mock Reviews Data
export const mockReviews = [
  {
    id: 1,
    product_id: 1,
    product_name: "Gentle Cleanser",
    customer_name: "Sarah Johnson",
    customer_email: "sarah@example.com",
    rating: 5,
    comment: "Amazing cleanser! My skin feels so clean and soft.",
    status: "approved",
    created_at: "2024-07-20"
  },
  {
    id: 2,
    product_id: 3,
    product_name: "Vitamin C Serum",
    customer_name: "Mike Chen",
    customer_email: "mike@example.com",
    rating: 4,
    comment: "Great serum, noticed brighter skin after 2 weeks of use.",
    status: "pending",
    created_at: "2024-07-22"
  },
  {
    id: 3,
    product_id: 7,
    product_name: "Ordinary Niacinamide",
    customer_name: "Emily Davis",
    customer_email: "emily@example.com",
    rating: 5,
    comment: "Perfect for controlling oil and minimizing pores!",
    status: "approved",
    created_at: "2024-07-21"
  }
];

// Mock Coupons Data
export const mockCoupons = [
  {
    id: 1,
    code: 'WELCOME20',
    name: 'Welcome New Customers',
    description: '20% off for first-time customers',
    type: 'percentage',
    value: 20,
    minOrderValue: 50,
    maxDiscount: 30,
    usageLimit: 1000,
    usedCount: 245,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    created_at: '2024-01-01',
    isFirstTimeOnly: true,
    applicableCategories: ['all']
  },
  {
    id: 2,
    code: 'SAVE15',
    name: 'Save $15 on Orders',
    description: '$15 off on orders over $100',
    type: 'fixed',
    value: 15,
    minOrderValue: 100,
    usageLimit: 500,
    usedCount: 87,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-03-31',
    created_at: '2024-01-15',
    applicableCategories: ['serum', 'moisturizer']
  },
  {
    id: 3,
    code: 'SUMMER25',
    name: 'Summer Sale',
    description: '25% off summer collection',
    type: 'percentage',
    value: 25,
    minOrderValue: 75,
    maxDiscount: 50,
    usageLimit: 200,
    usedCount: 156,
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    created_at: '2024-05-25',
    applicableCategories: ['sunscreen', 'cleanser']
  },
  {
    id: 4,
    code: 'EXPIRED10',
    name: 'Holiday Special',
    description: '10% off holiday items',
    type: 'percentage',
    value: 10,
    minOrderValue: 30,
    maxDiscount: 20,
    usageLimit: 300,
    usedCount: 300,
    status: 'expired',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    created_at: '2023-11-20',
    applicableCategories: ['all']
  },
  {
    id: 5,
    code: 'INACTIVE5',
    name: 'Test Coupon',
    description: '$5 off test coupon',
    type: 'fixed',
    value: 5,
    minOrderValue: 25,
    usageLimit: 50,
    usedCount: 0,
    status: 'inactive',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    created_at: '2024-01-30',
    applicableCategories: ['treatment']
  },
  {
    id: 6,
    code: 'SKINCARE30',
    name: 'Skincare Bundle',
    description: '30% off when buying 3+ items',
    type: 'percentage',
    value: 30,
    minOrderValue: 150,
    maxDiscount: 75,
    usageLimit: 100,
    usedCount: 42,
    status: 'active',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    created_at: '2024-06-28',
    applicableCategories: ['all']
  }
];

// Regular User API (existing)
export const mockApi = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Simulate successful login
    if (email === "demo@example.com" && password === "demo12") {
      return {
        token: "mock-jwt-token",
        user: {
          id: "1",
          email,
          first_name: "Demo",
          last_name: "User",
          phone: "+1234567890",
          skin_type: "combination",
          language: "en",
          date_of_birth: "1990-01-01",
          gender: "other",
          profile_image_url: ""
        }
      };
    }
    throw new Error("Invalid credentials");
  },

  register: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      token: "mock-jwt-token",
      user: {
        id: "2",
        ...userData,
      }
    };
  },

  getProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return { data: mockProducts };
  },

  getProduct: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error("Product not found");
    return { data: product };
  }
};

// Admin API
export const mockAdminApi = {
  // Admin Authentication
  adminLogin: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    if (email === "admin@skincare.com" && password === "admin123") {
      return {
        token: "mock-admin-jwt-token",
        admin: {
          id: "admin-1",
          email,
          name: "Admin User",
          role: "super_admin",
          permissions: ["all"]
        }
      };
    }
    throw new Error("Invalid admin credentials");
  },

  // Dashboard Analytics
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      revenue: {
        total: 15420.50,
        growth: 12.5
      },
      orders: {
        total: 156,
        growth: 8.3
      },
      customers: {
        total: 89,
        growth: 15.2
      },
      products: {
        total: mockProducts.length,
        growth: 5.1
      },
      topProducts: mockProducts.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name_en,
        sales: Math.floor(Math.random() * 100) + 10,
        revenue: (p.price * (Math.floor(Math.random() * 50) + 10)).toFixed(2)
      })),
      recentOrders: mockOrders.slice(0, 5)
    };
  },

  // Product Management
  getAdminProducts: async (page = 1, limit = 10, search = '', category = '', status = '') => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    let filteredProducts = [...mockProducts];
    
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name_en.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      }
    };
  },

  createProduct: async (productData: any) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const newProduct = {
      id: Math.max(...mockProducts.map(p => p.id)) + 1,
      ...productData,
      created_at: new Date().toISOString().split('T')[0]
    };
    mockProducts.push(newProduct);
    return { data: newProduct };
  },

  updateProduct: async (id: number, productData: any) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    
    mockProducts[index] = { ...mockProducts[index], ...productData };
    return { data: mockProducts[index] };
  },

  deleteProduct: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    
    mockProducts.splice(index, 1);
    return { success: true };
  },

  // Order Management
  getAdminOrders: async (page = 1, limit = 10, status = '') => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    let filteredOrders = [...mockOrders];
    
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    return {
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit)
      }
    };
  },

  updateOrderStatus: async (id: number, status: string) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error("Order not found");
    
    order.status = status;
    return { data: order };
  },

  // Customer Management
  getAdminCustomers: async (page = 1, limit = 10, search = '') => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    let filteredCustomers = [...mockCustomers];
    
    if (search) {
      filteredCustomers = filteredCustomers.filter(c => 
        c.first_name.toLowerCase().includes(search.toLowerCase()) ||
        c.last_name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    return {
      data: paginatedCustomers,
      pagination: {
        page,
        limit,
        total: filteredCustomers.length,
        totalPages: Math.ceil(filteredCustomers.length / limit)
      }
    };
  },

  // Review Management
  getAdminReviews: async (page = 1, limit = 10, status = '') => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    let filteredReviews = [...mockReviews];
    
    if (status) {
      filteredReviews = filteredReviews.filter(r => r.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    return {
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total: filteredReviews.length,
        totalPages: Math.ceil(filteredReviews.length / limit)
      }
    };
  },

  updateReviewStatus: async (id: number, status: string) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const review = mockReviews.find(r => r.id === id);
    if (!review) throw new Error("Review not found");
    
    review.status = status;
    return { data: review };
  },

  deleteReview: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const index = mockReviews.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Review not found");
    
    mockReviews.splice(index, 1);
    return { success: true };
  },

  // Coupon Management
  getCoupons: async (page = 1, limit = 10, search = '', status = '', type = '') => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    let filteredCoupons = [...mockCoupons];
    
    if (search) {
      filteredCoupons = filteredCoupons.filter(c => 
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status && status !== 'all') {
      filteredCoupons = filteredCoupons.filter(c => c.status === status);
    }
    
    if (type && type !== 'all') {
      filteredCoupons = filteredCoupons.filter(c => c.type === type);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex);
    
    return {
      data: paginatedCoupons,
      pagination: {
        page,
        limit,
        total: filteredCoupons.length,
        totalPages: Math.ceil(filteredCoupons.length / limit)
      }
    };
  },

  createCoupon: async (couponData: any) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const newCoupon = {
      id: Math.max(...mockCoupons.map(c => c.id)) + 1,
      ...couponData,
      usedCount: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    mockCoupons.push(newCoupon);
    return { data: newCoupon };
  },

  updateCoupon: async (id: number, couponData: any) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const index = mockCoupons.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Coupon not found");
    
    mockCoupons[index] = { ...mockCoupons[index], ...couponData };
    return { data: mockCoupons[index] };
  },

  deleteCoupon: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const index = mockCoupons.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Coupon not found");
    
    mockCoupons.splice(index, 1);
    return { success: true };
  },

  bulkUpdateCoupons: async (couponIds: number[], updates: any) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    couponIds.forEach(id => {
      const index = mockCoupons.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCoupons[index] = { ...mockCoupons[index], ...updates };
      }
    });
    
    return { success: true };
  },

  getCouponStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      total: mockCoupons.length,
      active: mockCoupons.filter(c => c.status === 'active').length,
      totalUses: mockCoupons.reduce((sum, c) => sum + c.usedCount, 0),
      expired: mockCoupons.filter(c => c.status === 'expired').length,
      totalSavings: 2450.75, // Mock total savings amount
      averageDiscount: 18.5 // Mock average discount percentage
    };
  },

  // Bulk Actions
  bulkUpdateProducts: async (productIds: number[], updates: any) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    productIds.forEach(id => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...updates };
      }
    });
    
    return { success: true };
  },

  bulkUpdateOrders: async (orderIds: number[], status: string) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    orderIds.forEach(id => {
      const order = mockOrders.find(o => o.id === id);
      if (order) {
        order.status = status;
      }
    });
    
    return { success: true };
  },

  bulkUpdateReviews: async (reviewIds: number[], status: string) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    reviewIds.forEach(id => {
      const review = mockReviews.find(r => r.id === id);
      if (review) {
        review.status = status;
      }
    });
    
    return { success: true };
  }
};