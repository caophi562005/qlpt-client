import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Contract, Room } from "../../types";

// Fake data cho demo
const fakeContracts: Contract[] = [
  {
    id: 1,
    room: 101,
    room_name: "Phòng A101",
    tenant: 1,
    tenant_name: "Nguyễn Văn A",
    start_date: "2024-01-15",
    end_date: "2024-12-15",
    deposit: "9000000",
    billing_cycle: "MONTHLY",
    status: "ACTIVE",
  },
];

const fakeAvailableRooms: Room[] = [
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
];

const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  useEffect(() => {
    // Simulate API call to get current contract
    const userContract = fakeContracts.find(
      (contract) => contract.tenant_name === user?.full_name
    );
    setCurrentContract(userContract || null);

    // Get available rooms
    setAvailableRooms(fakeAvailableRooms);
  }, [user]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseInt(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="tenant-dashboard">
      <div className="dashboard-header">
        <h1>Xin chào, {user?.full_name}</h1>
        <p className="welcome-text">
          Chào mừng bạn đến với hệ thống quản lý thuê phòng
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Current Contract Section */}
        <div className="dashboard-card contract-card">
          <div className="card-header">
            <h2>Hợp đồng hiện tại</h2>
          </div>
          <div className="card-content">
            {currentContract ? (
              <div className="contract-info">
                <div className="contract-room">
                  <h3>{currentContract.room_name}</h3>
                  <span
                    className={`status-badge ${currentContract.status.toLowerCase()}`}
                  >
                    {currentContract.status === "ACTIVE"
                      ? "Đang thuê"
                      : "Đã kết thúc"}
                  </span>
                </div>
                <div className="contract-details">
                  <div className="detail-item">
                    <span className="label">Ngày bắt đầu:</span>
                    <span className="value">
                      {formatDate(currentContract.start_date)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Ngày kết thúc:</span>
                    <span className="value">
                      {currentContract.end_date
                        ? formatDate(currentContract.end_date)
                        : "Chưa xác định"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Tiền cọc:</span>
                    <span className="value price">
                      {formatPrice(currentContract.deposit)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Chu kỳ thanh toán:</span>
                    <span className="value">
                      {currentContract.billing_cycle === "MONTHLY"
                        ? "Hàng tháng"
                        : "Hàng quý"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-contract">
                <p>Bạn hiện tại chưa có hợp đồng thuê phòng nào</p>
                <button className="btn-primary">Tìm phòng trống</button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card stats-card">
          <div className="card-header">
            <h2>Thống kê nhanh</h2>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{currentContract ? "1" : "0"}</div>
                <div className="stat-label">Hợp đồng đang thuê</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{availableRooms.length}</div>
                <div className="stat-label">Phòng còn trống</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {currentContract && currentContract.end_date
                    ? Math.ceil(
                        (new Date(currentContract.end_date).getTime() -
                          new Date().getTime()) /
                          (1000 * 3600 * 24)
                      )
                    : 0}
                </div>
                <div className="stat-label">Ngày còn lại</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rooms Section */}
      <div className="dashboard-card available-rooms-card">
        <div className="card-header">
          <h2>Phòng còn trống</h2>
          <p className="card-subtitle">
            Khám phá các phòng hiện có sẵn để thuê
          </p>
        </div>
        <div className="card-content">
          <div className="rooms-grid">
            {availableRooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span className="room-status empty">Trống</span>
                </div>
                <div className="room-details">
                  <div className="room-info">
                    <div className="info-item">
                      <span className="icon">📐</span>
                      <span>{room.area_m2} m²</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">🏢</span>
                      <span>Tòa {room.building}</span>
                    </div>
                  </div>
                  <div className="room-price">
                    <span className="price">
                      {formatPrice(room.base_price)}
                    </span>
                    <span className="period">/tháng</span>
                  </div>
                </div>
                <button className="btn-secondary room-btn">Xem chi tiết</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
