import React, { useState, useEffect } from "react";
import type { Room } from "../../types";

// Fake data cho demo
const fakeRooms: Room[] = [
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
];

const TenantRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filterBuilding, setFilterBuilding] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"price" | "area" | "name">("price");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  useEffect(() => {
    // Simulate API call to get available rooms
    setRooms(fakeRooms);
  }, []);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseInt(price));
  };

  const buildings = [...new Set(rooms.map((room) => room.building))].sort();

  const filteredAndSortedRooms = rooms
    .filter((room) => {
      if (filterBuilding !== "all" && room.building !== filterBuilding)
        return false;
      const price = parseInt(room.base_price);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return parseInt(a.base_price) - parseInt(b.base_price);
        case "area":
          return parseFloat(a.area_m2 || "0") - parseFloat(b.area_m2 || "0");
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const RoomCard: React.FC<{ room: Room }> = ({ room }) => (
    <div className="room-card available">
      <div className="room-image">
        <div className="room-image-placeholder">
          <span className="room-icon">🏠</span>
        </div>
        <div className="room-status-badge empty">Trống</div>
      </div>

      <div className="room-content">
        <div className="room-header">
          <h3>{room.name}</h3>
          <div className="room-building">Tòa {room.building}</div>
        </div>

        <div className="room-details">
          <div className="room-specs">
            <div className="spec-item">
              <span className="spec-icon">📐</span>
              <span className="spec-label">Diện tích:</span>
              <span className="spec-value">{room.area_m2} m²</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">💰</span>
              <span className="spec-label">Giá thuê:</span>
              <span className="spec-value price">
                {formatPrice(room.base_price)}/tháng
              </span>
            </div>
          </div>
        </div>

        <div className="room-amenities">
          <span className="amenity">📶 WiFi</span>
          <span className="amenity">❄️ Điều hòa</span>
          <span className="amenity">🚿 Nhà tắm riêng</span>
          <span className="amenity">🅿️ Chỗ để xe</span>
        </div>

        <div className="room-actions">
          <button className="btn-outline">Xem chi tiết</button>
          <button className="btn-primary">Đăng ký thuê</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tenant-rooms">
      <div className="page-header">
        <h1>Phòng trống</h1>
        <p className="page-subtitle">Khám phá các phòng hiện có sẵn để thuê</p>
      </div>

      <div className="rooms-filters">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="building-filter">Tòa nhà:</label>
            <select
              id="building-filter"
              value={filterBuilding}
              onChange={(e) =>
                setFilterBuilding(
                  e.target.value === "all" ? "all" : parseInt(e.target.value)
                )
              }
              className="filter-select"
            >
              <option value="all">Tất cả tòa</option>
              {buildings.map((building) => (
                <option key={building} value={building}>
                  Tòa {building}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">Sắp xếp theo:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "price" | "area" | "name")
              }
              className="filter-select"
            >
              <option value="price">Giá thuê</option>
              <option value="area">Diện tích</option>
              <option value="name">Tên phòng</option>
            </select>
          </div>

          <div className="filter-group price-range">
            <label>Khoảng giá:</label>
            <div className="price-range-inputs">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
                placeholder="Từ"
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                placeholder="Đến"
                className="price-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rooms-summary">
        <p>
          Tìm thấy <strong>{filteredAndSortedRooms.length}</strong> phòng trống
        </p>
      </div>

      <div className="rooms-grid">
        {filteredAndSortedRooms.length > 0 ? (
          filteredAndSortedRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Không tìm thấy phòng nào</h3>
            <p>Thử thay đổi bộ lọc để xem thêm phòng</p>
            <button
              className="btn-secondary"
              onClick={() => {
                setFilterBuilding("all");
                setPriceRange([0, 10000000]);
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantRooms;
