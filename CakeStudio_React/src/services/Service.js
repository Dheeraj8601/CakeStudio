import qs from "qs";

import axios from "axios";

// =========================================================
// BASE URLS
// =========================================================

const CS_API_BASE_URL = window.appConfig.CS_API_BASE_URL;

const CS_BASE_URL = window.appConfig.CS_BASE_URL;

// =========================================================
// AXIOS INSTANCE
// =========================================================

const api = axios.create({
  baseURL: CS_API_BASE_URL,

  // Required for HttpOnly authentication cookies
  withCredentials: true,
});

// =========================================================
// CSRF TOKEN
// =========================================================

let csrfToken = null;

let csrfTokenPromise = null;


const getCsrfToken = async () => {

    // Reuse token if already fetched.
    if (csrfToken) {
        return csrfToken;
    }


    // Prevent multiple simultaneous requests from
    // requesting multiple CSRF tokens.
    if (!csrfTokenPromise) {

        csrfTokenPromise = api
            .get("Csrf/token", {
                skipCsrf: true
            })
            .then((response) => {

                csrfToken = response.data.token;

                return csrfToken;
            })
            .finally(() => {

                csrfTokenPromise = null;

            });
    }


    return csrfTokenPromise;
};

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================

api.interceptors.request.use(
    async (config) => {

        // -------------------------------------------------
        // Remove internal skipAuth flag
        // -------------------------------------------------

        if (config.headers?.skipAuth) {
            delete config.headers.skipAuth;
        }


        // -------------------------------------------------
        // Skip CSRF token for the CSRF-token request itself
        // -------------------------------------------------

        if (config.skipCsrf) {

            delete config.skipCsrf;

            return config;
        }


        // -------------------------------------------------
        // CSRF required only for state-changing requests
        // -------------------------------------------------

        const method =
            config.method?.toLowerCase();


        const requiresCsrf =
            method === "post" ||
            method === "put" ||
            method === "patch" ||
            method === "delete";


        if (requiresCsrf) {

            const token =
                await getCsrfToken();


            config.headers =
                config.headers || {};


            config.headers["X-CSRF-TOKEN"] =
                token;
        }


        return config;
    },

    (error) => Promise.reject(error)
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================
//
// If access_token expires:
//
// API
//   ↓ 401
// refresh-token endpoint
//   ↓
// refresh_token HttpOnly cookie
//   ↓
// backend rotates tokens
//   ↓
// new access_token cookie
//   ↓
// retry original request
//
// =========================================================

api.interceptors.response.use(
  // -----------------------------------------------------
  // SUCCESS
  // -----------------------------------------------------

  (response) => response,

  // -----------------------------------------------------
  // ERROR
  // -----------------------------------------------------

  async (error) => {
    const originalRequest = error.config;

    // =================================================
    // NOT 401
    // =================================================

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    // =================================================
    // ENDPOINTS THAT MUST NOT TRIGGER REFRESH
    // =================================================
    //
    // Otherwise:
    //
    // login 401
    //    ↓
    // refresh
    //    ↓
    // refresh 401
    //    ↓
    // loop
    //
    // =================================================

    const requestUrl = originalRequest?.url || "";

    const skipRefresh =
      requestUrl.includes("Auth/login") ||
      requestUrl.includes("Auth/refresh-token") ||
      requestUrl.includes("Auth/google") ||
      requestUrl.includes("Auth/logout");

    if (skipRefresh) {
      return Promise.reject(error);
    }

    // =================================================
    // PREVENT MULTIPLE RETRIES
    // =================================================

    originalRequest._retry = true;

    try {
      // =============================================
      // REFRESH ACCESS TOKEN
      // =============================================
      //
      // NO refresh token is sent from JavaScript.
      //
      // Browser sends:
      //
      // refresh_token=<HttpOnly cookie>
      //
      // =============================================

      await api.post(
        "Auth/refresh-token",

        null,

        {
          headers: {
            skipAuth: true,
          },
        },
      );

      // =============================================
      // RETRY ORIGINAL REQUEST
      // =============================================
      //
      // Backend has now issued a new access_token
      // cookie.
      //
      // Axios/browser automatically sends it.
      //
      // =============================================

      return api(originalRequest);
    } catch (refreshError) {
      // if (window.location.pathname !== "/login") {
      //   window.location.href = "/login";
      // }

      return Promise.reject(refreshError);
    }
  },
);

// =========================================================
// SERVICE
// =========================================================

class Service {
  login(method, value) {
    return api.post(
      method,

      value,

      {
        headers: {
          skipAuth: true,
        },
      },
    );
  }

  logout() {
    return api.post(
      "Auth/logout",

      null,

      {
        headers: {
          skipAuth: true,
        },
      },
    );
  }

  register(method, value) {
    return api.post(
      method,

      value,

      {
        headers: {
          skipAuth: true,
        },
      },
    );
  }

  forgotPassword(email) {
    return api.post(
      "Auth/forgot-password",

      {
        email,
      },

      {
        headers: {
          skipAuth: true,
        },
      },
    );
  }

  resetPassword(token, newPassword, confirmPassword) {
    return api.post(
      "Auth/reset-password",

      {
        token,
        newPassword,
        confirmPassword,
      },

      {
        headers: {
          skipAuth: true,
        },
      },
    );
  }

  googleLogin(credential) {
    return api.post(
      "Auth/google-login",

      {
        credential,
      },

      {
        headers: {
          skipAuth: true,
        },
      },
    );
  }

  // =====================================================
  // CURRENT AUTHENTICATED USER
  // =====================================================

  getCurrentUser() {
    return api.get("Auth/me");
  }

  // ---------------- Category ----------------

  getAllCategories() {
    return api.get("/Category/all");
  }

  getCategoryById(id) {
    return api.get(`/Category/${id}`);
  }

  getCategories(params) {
    return api.get("/Category", {
      params,
    });
  }

  createCategory(formData) {
    return api.post("/Category/CreateCategory", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  updateCategory(formData) {
    return api.put("/Category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  deleteCategory(id) {
    return api.delete(`/Category/${id}`);
  }

  getCategoriesWithFilters(params) {
    return api.get("/Category/getCategories", {
      params,
    });
  }

  // ---------------- User ----------------

  getUsers(params) {
    return api.get("/users/getUsers", {
      params,
    });
  }

  getAllUsers() {
    return api.get("/users/all");
  }

  getUserById(id) {
    return api.get(`/users/${id}`);
  }

  toggleUserStatus(id) {
    return api.patch(`/users/${id}/toggle-status`);
  }

  deleteUser(id) {
    return api.delete(`/users/${id}`);
  }

  updateUser(data) {
    return api.put("/users", data);
  }

  sendChangePasswordOtp(currentPassword) {
    return api.post("/users/send-change-password-otp", {
      currentPassword,
    });
  }

  changePassword(data) {
    return api.put("/users/change-password", data);
  }

  // ---------------- Cake ----------------

  getCakes(params) {
    return api.get("/Cake/getCakes", {
      params,
    });
  }

  getAllCakes() {
    return api.get("/Cake/all");
  }

  getCakeById(id) {
    return api.get(`/Cake/${id}`);
  }

  createCake(formData) {
    return api.post("/Cake/createCake", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  updateCake(formData) {
    return api.put("/Cake/updateCake", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  deleteCake(id) {
    return api.delete(`/Cake/${id}`);
  }

  // ---------------- Cake Catalog ----------------

  getCakeCatalog(params) {
    return api.get("/cake-catalog", {
      params,

      paramsSerializer: {
        serialize: (params) =>
          qs.stringify(params, {
            arrayFormat: "repeat",
          }),
      },
    });
  }

  getCakeDetails(id) {
    return api.get(`/cake-catalog/${id}`);
  }

  getCartItems(productIds) {
    return api.post("/cake-catalog/cart-items", {
      productIds,
    });
  }

  // ---------------- Cart ----------------

  addToCart(data) {
    return api.post("/cart/add", data);
  }

  updateCartQuantity(data) {
    return api.put("/cart/quantity", data);
  }

  removeCartItem(cartItemId) {
    return api.delete(`/cart/${cartItemId}`);
  }

  getMyCart() {
    return api.get("/cart");
  }

  // ---------------- Addresses ----------------

  createAddress(data) {
    return api.post("/address", data);
  }

  updateAddress(data) {
    return api.put("/address", data);
  }

  deleteAddress(id) {
    return api.delete(`/address/${id}`);
  }

  setDefaultAddress(id) {
    return api.put(`/address/${id}/default`);
  }

  getMyAddresses() {
    return api.get("/address");
  }

  // ---------------- Wishlist ----------------

  addToWishlist(data) {
    return api.post("/wishlist", data);
  }

  removeWishlistItem(wishlistId) {
    return api.delete(`/wishlist/${wishlistId}`);
  }

  getMyWishlist() {
    return api.get("/wishlist");
  }

  moveWishlistToCart() {
    return api.post("/wishlist/move-all-to-cart");
  }

  getWishlist(params) {
    return api.get("/wishlist/getWishlist", {
      params,
    });
  }

  getWishlistCakeIds() {
    return api.get("/wishlist/cake-ids");
  }

  removeWishlistByCakeId(id) {
    return api.delete("/wishlist/removebycakeid", {
      params: {
        id,
      },
    });
  }

  // ---------------- Contact ----------------

  sendContactMessage(data) {
    return api.post("/contact", data);
  }

  // ---------------- Orders ----------------

  checkout(order) {
    return api.post("/orders/checkout", order);
  }

  getMyOrders() {
    return api.get("/orders");
  }

  getOrderDetails(id) {
    return api.get(`/orders/${id}`);
  }

  cancelOrder(orderId) {
    return api.patch(`/orders/${orderId}/cancel`);
  }

  getRecentOrders() {
    return api.get("/orders/recent");
  }

  updateOrderStatus(orderId, status) {
    return api.patch(`/orders/${orderId}/status`, {
      orderStatus: status,
    });
  }

  getOrders(params) {
    return api.get("/orders/admin", {
      params,
    });
  }

  // ---------------- Payment ----------------

  createPaymentSession(orderId) {
    return api.post("/payment/create-session", {
      orderId,
    });
  }

  verifyPayment(orderId, sessionId) {
    return api.post("/payment/verify", {
      orderId,
      sessionId,
    });
  }

  refundPayment(orderId, data) {
    return api.post(`/payment/order/${orderId}/refund`, data);
  }

  // ---------------- Reviews ----------------

  createReview(data) {
    return api.post("/reviews", data);
  }

  updateReview(data) {
    return api.put("/reviews", data);
  }

  deleteReview(id) {
    return api.delete(`/reviews/${id}`);
  }

  getCakeReviews(cakeId) {
    return api.get(`/reviews/cake/${cakeId}`);
  }

  getReviewByOrderItem(orderItemId) {
    return api.get(`/reviews/order-item/${orderItemId}`);
  }

  getRatingFilters() {
    return api.get("/cake-catalog/rating-filters");
  }

  getReviews(params) {
    return api.get("/reviews/admin", {
      params,
    });
  }

  replyReview(data) {
    return api.post("/reviews/reply", data);
  }

  // ---------------- Home ----------------

  getFeaturedCakes() {
    return api.get("/cake-catalog/featured");
  }

  // ---------------- Invoice ----------------

  async downloadInvoice(orderId) {
    try {
      const response = await api.get(`/Invoice/${orderId}/download`, {
        responseType: "blob",
      });

      return response;
    } catch (error) {
      console.error("Download invoice failed:", error);

      throw error;
    }
  }
}

export default new Service();
