import type { User, Room, Contract } from "../types";

// Fake Users
export const fakeUsers: User[] = [
  {
    id: 1,
    email: "tenant@demo.com",
    full_name: "Nguyễn Văn A",
    role: "TENANT",
  },
  {
    id: 2,
    email: "admin@demo.com",
    full_name: "Quản lý hệ thống",
    role: "OWNER",
  },
  {
    id: 3,
    email: "tenant2@demo.com",
    full_name: "Trần Thị B",
    role: "TENANT",
  },
];

// Fake Rooms
export const fakeRooms: Room[] = [
  {
    id: 1,
    name: "Phòng A101",
    area_m2: "25",
    base_price: "4500000",
    status: "RENTED",
    building: 1,
  },
  {
    id: 2,
    name: "Phòng B102",
    area_m2: "25",
    base_price: "4500000",
    status: "EMPTY",
    building: 1,
  },
  {
    id: 3,
    name: "Phòng C203",
    area_m2: "30",
    base_price: "5200000",
    status: "EMPTY",
    building: 2,
  },
  {
    id: 4,
    name: "Phòng A205",
    area_m2: "28",
    base_price: "4800000",
    status: "EMPTY",
    building: 1,
  },
  {
    id: 5,
    name: "Phòng D301",
    area_m2: "35",
    base_price: "6000000",
    status: "EMPTY",
    building: 3,
  },
  {
    id: 6,
    name: "Phòng B104",
    area_m2: "22",
    base_price: "4200000",
    status: "EMPTY",
    building: 1,
  },
  {
    id: 7,
    name: "Phòng C205",
    area_m2: "32",
    base_price: "5500000",
    status: "EMPTY",
    building: 2,
  },
  {
    id: 8,
    name: "Phòng A103",
    area_m2: "24",
    base_price: "4300000",
    status: "RENTED",
    building: 1,
  },
  {
    id: 9,
    name: "Phòng B201",
    area_m2: "27",
    base_price: "4700000",
    status: "MAINT",
    building: 1,
  },
  {
    id: 10,
    name: "Phòng D302",
    area_m2: "40",
    base_price: "7000000",
    status: "EMPTY",
    building: 3,
  },
];

// Fake Contracts
export const fakeContracts: Contract[] = [
  {
    id: 1,
    room: 1,
    room_name: "Phòng A101",
    tenant: 1,
    tenant_name: "Nguyễn Văn A",
    start_date: "2024-01-15",
    end_date: "2024-12-15",
    deposit: "9000000",
    billing_cycle: "MONTHLY",
    status: "ACTIVE",
  },
  {
    id: 2,
    room: 8,
    room_name: "Phòng A103",
    tenant: 3,
    tenant_name: "Trần Thị B",
    start_date: "2024-03-01",
    end_date: "2025-02-28",
    deposit: "8600000",
    billing_cycle: "MONTHLY",
    status: "ACTIVE",
  },
  {
    id: 3,
    room: 5,
    room_name: "Phòng D301",
    tenant: 1,
    tenant_name: "Nguyễn Văn A",
    start_date: "2023-06-01",
    end_date: "2023-12-31",
    deposit: "12000000",
    billing_cycle: "MONTHLY",
    status: "ENDED",
  },
];

// Helper functions
export const getRoomsByStatus = (status: "EMPTY" | "RENTED" | "MAINT") => {
  return fakeRooms.filter((room) => room.status === status);
};

export const getContractsByTenant = (tenantId: number) => {
  return fakeContracts.filter((contract) => contract.tenant === tenantId);
};

export const getActiveContractsByTenant = (tenantId: number) => {
  return fakeContracts.filter(
    (contract) => contract.tenant === tenantId && contract.status === "ACTIVE"
  );
};

export const getEndedContractsByTenant = (tenantId: number) => {
  return fakeContracts.filter(
    (contract) => contract.tenant === tenantId && contract.status === "ENDED"
  );
};

export const getAvailableRooms = () => {
  return getRoomsByStatus("EMPTY");
};

export const getUserById = (id: number) => {
  return fakeUsers.find((user) => user.id === id);
};

export const getRoomById = (id: number) => {
  return fakeRooms.find((room) => room.id === id);
};

export const getContractById = (id: number) => {
  return fakeContracts.find((contract) => contract.id === id);
};

// Statistics
export const getStatistics = () => {
  const totalRooms = fakeRooms.length;
  const emptyRooms = getRoomsByStatus("EMPTY").length;
  const rentedRooms = getRoomsByStatus("RENTED").length;
  const maintenanceRooms = getRoomsByStatus("MAINT").length;
  const activeContracts = fakeContracts.filter(
    (c) => c.status === "ACTIVE"
  ).length;
  const totalRevenue = fakeContracts
    .filter((c) => c.status === "ACTIVE")
    .reduce((sum, contract) => {
      const room = getRoomById(contract.room);
      return sum + (room ? parseInt(room.base_price) : 0);
    }, 0);

  return {
    totalRooms,
    emptyRooms,
    rentedRooms,
    maintenanceRooms,
    activeContracts,
    totalRevenue,
    occupancyRate: Math.round((rentedRooms / totalRooms) * 100),
  };
};
