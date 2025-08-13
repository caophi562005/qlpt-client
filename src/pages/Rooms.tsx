import React, { useState, useEffect } from "react";
import { roomsAPI } from "../services/api";
import type { Room } from "../types";
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  Home,
  DollarSign,
  Maximize,
} from "lucide-react";

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    area_m2: "",
    base_price: "",
    status: "EMPTY" as "EMPTY" | "RENTED" | "MAINT",
    building: 1,
  });

  useEffect(() => {
    fetchRooms();
  }, [searchTerm]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await roomsAPI.getRooms({
        search: searchTerm || undefined,
        page_size: 50,
      });
      setRooms(response.results);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRoom) {
        await roomsAPI.updateRoom(editingRoom.id, formData);
      } else {
        await roomsAPI.createRoom(formData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      area_m2: room.area_m2 || "",
      base_price: room.base_price,
      status: room.status,
      building: room.building,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        await roomsAPI.deleteRoom(id);
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      area_m2: "",
      base_price: "",
      status: "EMPTY",
      building: 1,
    });
    setEditingRoom(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      EMPTY: { label: "Trống", className: "status-empty" },
      RENTED: { label: "Đã thuê", className: "status-rented" },
      MAINT: { label: "Bảo trì", className: "status-maint" },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <span className={`status-badge ${statusInfo?.className}`}>
        {statusInfo?.label || status}
      </span>
    );
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(amount));
  };

  return (
    <div className="rooms-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Quản lý phòng</h1>
          <p>Quản lý danh sách phòng trọ trong hệ thống</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Thêm phòng mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="page-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách phòng...</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-card-header">
                <div className="room-icon">
                  <Home size={24} />
                </div>
                <div className="room-actions">
                  <button
                    onClick={() => handleEdit(room)}
                    className="action-btn"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="action-btn danger"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="room-card-content">
                <h3>{room.name}</h3>
                {getStatusBadge(room.status)}

                <div className="room-details">
                  {room.area_m2 && (
                    <div className="detail-item">
                      <Maximize size={16} />
                      <span>{room.area_m2} m²</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <DollarSign size={16} />
                    <span>{formatCurrency(room.base_price)}</span>
                  </div>
                  <div className="detail-item">
                    <Building size={16} />
                    <span>Tòa nhà {room.building}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rooms.length === 0 && !isLoading && (
        <div className="empty-state">
          <Building size={48} />
          <h3>Chưa có phòng nào</h3>
          <p>Bắt đầu bằng cách thêm phòng đầu tiên</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Thêm phòng mới
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng mới"}</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Tên phòng *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: P101, Phòng A1..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="area_m2">Diện tích (m²)</label>
                  <input
                    type="number"
                    id="area_m2"
                    value={formData.area_m2}
                    onChange={(e) =>
                      setFormData({ ...formData, area_m2: e.target.value })
                    }
                    placeholder="Ví dụ: 25"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="base_price">Giá cơ bản (VNĐ) *</label>
                  <input
                    type="number"
                    id="base_price"
                    value={formData.base_price}
                    onChange={(e) =>
                      setFormData({ ...formData, base_price: e.target.value })
                    }
                    placeholder="Ví dụ: 3000000"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                  >
                    <option value="EMPTY">Trống</option>
                    <option value="RENTED">Đã thuê</option>
                    <option value="MAINT">Bảo trì</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="building">Tòa nhà *</label>
                  <input
                    type="number"
                    id="building"
                    value={formData.building}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        building: parseInt(e.target.value),
                      })
                    }
                    placeholder="Ví dụ: 1"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoom ? "Cập nhật" : "Thêm phòng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
