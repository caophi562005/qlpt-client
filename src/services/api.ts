import axios from "axios";
import type {
  Room,
  Contract,
  ContractCreate,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  PaginatedResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_END_POINT || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/auth/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post("/api/auth/login/", credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<void> => {
    const response = await api.post("/api/auth/register/", userData);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post("/api/auth/refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  },
};

// Rooms API
export const roomsAPI = {
  getRooms: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Room>> => {
    const response = await api.get("/api/rooms/", { params });
    return response.data;
  },

  getRoom: async (id: number): Promise<Room> => {
    const response = await api.get(`/api/rooms/${id}/`);
    return response.data;
  },

  createRoom: async (roomData: Omit<Room, "id">): Promise<Room> => {
    const response = await api.post("/api/rooms/", roomData);
    return response.data;
  },

  updateRoom: async (id: number, roomData: Partial<Room>): Promise<Room> => {
    const response = await api.patch(`/api/rooms/${id}/`, roomData);
    return response.data;
  },

  deleteRoom: async (id: number): Promise<void> => {
    await api.delete(`/api/rooms/${id}/`);
  },
};

// Contracts API
export const contractsAPI = {
  getContracts: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Contract>> => {
    const response = await api.get("/api/contracts/", { params });
    return response.data;
  },

  getContract: async (id: number): Promise<Contract> => {
    const response = await api.get(`/api/contracts/${id}/`);
    return response.data;
  },

  createContract: async (
    contractData: Omit<ContractCreate, "id" | "status">
  ): Promise<ContractCreate> => {
    const response = await api.post("/api/contracts/", contractData);
    return response.data;
  },

  updateContract: async (
    id: number,
    contractData: Partial<Contract>
  ): Promise<Contract> => {
    const response = await api.patch(`/api/contracts/${id}/`, contractData);
    return response.data;
  },

  deleteContract: async (id: number): Promise<void> => {
    await api.delete(`/api/contracts/${id}/`);
  },

  endContract: async (
    id: number,
    contractData: Contract
  ): Promise<Contract> => {
    const response = await api.post(`/api/contracts/${id}/end/`, contractData);
    return response.data;
  },
};

export default api;
