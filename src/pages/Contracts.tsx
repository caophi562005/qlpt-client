import React, { useState, useEffect } from "react";
import { contractsAPI, roomsAPI } from "../services/api";
import type { Contract, Room } from "../types";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  DollarSign,
  Clock,
} from "lucide-react";

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState({
    room: 0,
    tenant: 1, // Mock tenant ID
    start_date: "",
    end_date: "",
    deposit: "",
    billing_cycle: "MONTHLY",
  });

  useEffect(() => {
    fetchContracts();
    fetchRooms();
  }, [searchTerm]);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const response = await contractsAPI.getContracts({
        search: searchTerm || undefined,
        page_size: 50,
        ordering: "-id",
      });
      setContracts(response.results);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getRooms({ page_size: 100 });
      setRooms(response.results);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingContract) {
        await contractsAPI.updateContract(editingContract.id, formData);
      } else {
        await contractsAPI.createContract(formData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchContracts();
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      room: contract.room,
      tenant: contract.tenant,
      start_date: contract.start_date,
      end_date: contract.end_date || "",
      deposit: contract.deposit,
      billing_cycle: contract.billing_cycle,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này?")) {
      try {
        await contractsAPI.deleteContract(id);
        fetchContracts();
      } catch (error) {
        console.error("Error deleting contract:", error);
      }
    }
  };

  const handleEndContract = async (contract: Contract) => {
    if (window.confirm("Bạn có chắc chắn muốn kết thúc hợp đồng này?")) {
      try {
        await contractsAPI.endContract(contract.id, {
          ...contract,
          end_date: new Date().toISOString().split("T")[0],
          status: "ENDED",
        });
        fetchContracts();
      } catch (error) {
        console.error("Error ending contract:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      room: 0,
      tenant: 1,
      start_date: "",
      end_date: "",
      deposit: "",
      billing_cycle: "MONTHLY",
    });
    setEditingContract(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ACTIVE: { label: "Đang hiệu lực", className: "status-active" },
      ENDED: { label: "Đã kết thúc", className: "status-ended" },
      SUSPENDED: { label: "Tạm ngưng", className: "status-suspended" },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const availableRooms = rooms.filter(
    (room) =>
      room.status === "EMPTY" ||
      (editingContract && room.id === editingContract.room)
  );

  return (
    <div className="contracts-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Quản lý hợp đồng</h1>
          <p>Quản lý hợp đồng thuê phòng trong hệ thống</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Tạo hợp đồng mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="page-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm hợp đồng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Contracts Table */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách hợp đồng...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="contracts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phòng</th>
                <th>Khách thuê</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Tiền cọc</th>
                <th>Chu kỳ thanh toán</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>#{contract.id}</td>
                  <td>
                    <div className="cell-content">
                      <Building size={16} />
                      {contract.room_name}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <User size={16} />
                      {contract.tenant_name}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <Calendar size={16} />
                      {formatDate(contract.start_date)}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <Calendar size={16} />
                      {contract.end_date
                        ? formatDate(contract.end_date)
                        : "Chưa xác định"}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <DollarSign size={16} />
                      {formatCurrency(contract.deposit)}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <Clock size={16} />
                      {contract.billing_cycle === "MONTHLY"
                        ? "Hàng tháng"
                        : contract.billing_cycle}
                    </div>
                  </td>
                  <td>{getStatusBadge(contract.status)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleEdit(contract)}
                        className="action-btn"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      {contract.status === "ACTIVE" && (
                        <button
                          onClick={() => handleEndContract(contract)}
                          className="action-btn warning"
                          title="Kết thúc hợp đồng"
                        >
                          <Clock size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contract.id)}
                        className="action-btn danger"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {contracts.length === 0 && !isLoading && (
        <div className="empty-state">
          <FileText size={48} />
          <h3>Chưa có hợp đồng nào</h3>
          <p>Bắt đầu bằng cách tạo hợp đồng đầu tiên</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Tạo hợp đồng mới
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingContract ? "Chỉnh sửa hợp đồng" : "Tạo hợp đồng mới"}
              </h2>
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
                <label htmlFor="room">Phòng *</label>
                <select
                  id="room"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: parseInt(e.target.value) })
                  }
                  required
                >
                  <option value={0}>Chọn phòng</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {formatCurrency(room.base_price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    id="start_date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">Ngày kết thúc</label>
                  <input
                    type="date"
                    id="end_date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deposit">Tiền cọc (VNĐ) *</label>
                  <input
                    type="number"
                    id="deposit"
                    value={formData.deposit}
                    onChange={(e) =>
                      setFormData({ ...formData, deposit: e.target.value })
                    }
                    placeholder="Ví dụ: 3000000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="billing_cycle">Chu kỳ thanh toán</label>
                  <select
                    id="billing_cycle"
                    value={formData.billing_cycle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_cycle: e.target.value,
                      })
                    }
                  >
                    <option value="MONTHLY">Hàng tháng</option>
                    <option value="QUARTERLY">Hàng quý</option>
                    <option value="YEARLY">Hàng năm</option>
                  </select>
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
                  {editingContract ? "Cập nhật" : "Tạo hợp đồng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
