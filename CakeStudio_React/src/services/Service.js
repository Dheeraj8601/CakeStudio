import SessionManage from "../Session/SessionManage";
import qs from "qs";
import axios from 'axios';

const CS_API_BASE_URL = window.appConfig.CS_API_BASE_URL;
const CS_BASE_URL = window.appConfig.CS_BASE_URL;

const api = axios.create({
    baseURL: CS_API_BASE_URL,
});

api.interceptors.request.use((config) => {

    if (!config.headers.skipAuth) {

        const token = SessionManage.getTokenId();
        const userId = SessionManage.getUserId();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (userId) {
            config.headers.loggedInUser = userId;
        }
    }

    if (config.headers?.skipAuth) {
        delete config.headers.skipAuth;
    }

    return config;
});


api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;
        if (!originalRequest) {
            return Promise.reject(error);
        }
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("Auth/login") &&
            !originalRequest.url.includes("Auth/refresh-token")
        ) {

            originalRequest._retry = true;

            try {

                const refreshToken = SessionManage.getRefreshToken();
                console.log(refreshToken, "refreshToken")
                alert(refreshToken)
                const response = await axios.post(
                    CS_API_BASE_URL + "Auth/refresh-token",
                    {
                        refreshToken: refreshToken
                    }
                );

                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;

                SessionManage.setTokenId(newAccessToken);
                SessionManage.setRefreshToken(newRefreshToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            }
            catch (err) {

                SessionManage.clearSession();

                window.location.href = "/login";

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

class Service {
    login(method, value) {
        return api.post(method, value, {
            headers: {
                skipAuth: true
            }
        });
    }

    register(method, value) {
        return api.post(method, value, {
            headers: {
                skipAuth: true
            }
        })
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
            params
        });
    }

    createCategory(formData) {
        return api.post("/Category/CreateCategory", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }

    updateCategory(formData) {
        return api.put("/Category", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }

    deleteCategory(id) {
        return api.delete(`/Category/${id}`);
    }

    getCategoriesWithFilters(params) {
        return api.get("/Category/getCategories", {
            params
        });
    }


    //------- User ------

    getUsers(params) {
        return api.get("/users/getUsers", {
            params
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

    //----- Cake---------
    getCakes(params) {
        return api.get("/Cake/getCakes", {
            params
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
                "Content-Type": "multipart/form-data"
            }
        });
    }

    updateCake(formData) {
        return api.put("/Cake/updateCake", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }

    deleteCake(id) {
        return api.delete(`/Cake/${id}`);
    }

    //------ cake catalog ----
    getCakeCatalog(params) {
    return api.get("/cake-catalog", {
        params,
        paramsSerializer: {
            serialize: (params) =>
                qs.stringify(params, {
                    arrayFormat: "repeat"
                })
        }
    });
}

    getCakeDetails(id) {
        return api.get(`/cake-catalog/${id}`);
    }
}

export default new Service();