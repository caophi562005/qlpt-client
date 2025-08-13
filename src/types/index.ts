export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "OWNER" | "TENANT" | "TECH";
}

export interface Room {
  id: number;
  name: string;
  area_m2?: string;
  base_price: string;
  status: "EMPTY" | "RENTED" | "MAINT";
  building: number;
}

export interface Contract {
  id: number;
  room: number;
  room_name: string;
  tenant: number;
  tenant_name: string;
  start_date: string;
  end_date?: string;
  deposit: string;
  billing_cycle: string;
  status: "ACTIVE" | "ENDED" | "SUSPENDED";
}

export interface ContractCreate {
  id: number;
  room: number;
  tenant: number;
  start_date: string;
  end_date?: string;
  deposit: string;
  billing_cycle: string;
  status: "ACTIVE" | "ENDED" | "SUSPENDED";
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  role: "OWNER" | "TENANT" | "TECH";
  password: string;
  password_confirm: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
