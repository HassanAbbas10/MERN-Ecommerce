import { axiosInstance } from "./api.js";

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const formData = new FormData();
    formData.append("fullName", userData.fullName);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    
    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    const response = await axiosInstance.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/users/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get("/users/current-user");
    return response.data;
  },
};

// Product API calls
export const productAPI = {
  getAllProducts: async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  addProduct: async (productData) => {
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("quantity", productData.quantity);
    formData.append("category", productData.category);
    formData.append("rating", productData.rating || 0);

    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axiosInstance.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};

// Order API calls
export const orderAPI = {
  createOrder: async (orderData) => {
    const response = await axiosInstance.post("/orders", orderData);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await axiosInstance.get("/orders");
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await axiosInstance.delete(`/orders/${id}`);
    return response.data;
  },

  // Admin order APIs
  getAdminOrders: async (params = {}) => {
    const response = await axiosInstance.get("/orders/admin/all", { params });
    return response.data;
  },

  updateAdminOrderStatus: async (id, statusData) => {
    const response = await axiosInstance.put(`/orders/admin/status/${id}`, statusData);
    return response.data;
  },

  getOrderStats: async () => {
    const response = await axiosInstance.get("/orders/admin/stats");
    return response.data;
  },
};

// Dashboard API calls
export const dashboardAPI = {
  getAnalytics: async () => {
    const response = await axiosInstance.get("/dashboard/analytics");
    return response.data;
  },

  getSalesAnalytics: async (period = '7d') => {
    const response = await axiosInstance.get(`/dashboard/analytics/sales?period=${period}`);
    return response.data;
  },
};

// Customer API calls
export const customerAPI = {
  getAllCustomers: async (params = {}) => {
    const response = await axiosInstance.get("/users/customers", { params });
    return response.data;
  },

  getCustomerAnalytics: async () => {
    const response = await axiosInstance.get("/users/customers/analytics");
    return response.data;
  },
};

// Customize API calls
export const customizeAPI = {
  getCustomizableShirts: async () => {
    const response = await axiosInstance.get("/customize/shirts");
    return response.data;
  },

  getUserCustomProducts: async (userId) => {
    const response = await axiosInstance.get(`/customize/user/${userId}`);
    return response.data;
  },

  createCustomProduct: async (customData) => {
    const response = await axiosInstance.post("/customize", customData);
    return response.data;
  },

  updateCustomProduct: async (customProductId, customData) => {
    const response = await axiosInstance.put(`/customize/${customProductId}`, customData);
    return response.data;
  },

  deleteCustomProduct: async (customProductId) => {
    const response = await axiosInstance.delete(`/customize/${customProductId}`);
    return response.data;
  },

  getCustomProductById: async (customProductId) => {
    const response = await axiosInstance.get(`/customize/${customProductId}`);
    return response.data;
  },
};
