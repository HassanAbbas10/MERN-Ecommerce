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
};
