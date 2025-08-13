import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { roomsAPI, contractsAPI } from "../services/api";
import type { Contract } from "../types";
import {
  Building,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    emptyRooms: 0,
    rentedRooms: 0,
    totalContracts: 0,
    activeContracts: 0,
    totalRevenue: 0,
  });
  const [recentContracts, setRecentContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch rooms
        const roomsResponse = await roomsAPI.getRooms();
        const rooms = roomsResponse.results;

        // Fetch contracts
        const contractsResponse = await contractsAPI.getContracts({
          page_size: 10,
          ordering: "-id",
        });
        const contracts = contractsResponse.results;

        // Calculate stats
        const emptyRooms = rooms.filter(
          (room) => room.status === "EMPTY"
        ).length;
        const rentedRooms = rooms.filter(
          (room) => room.status === "RENTED"
        ).length;
        const activeContracts = contracts.filter(
          (contract) => contract.status === "ACTIVE"
        ).length;

        // Calculate total revenue from active contracts
        const totalRevenue = contracts
          .filter((contract) => contract.status === "ACTIVE")
          .reduce((sum, contract) => sum + parseFloat(contract.deposit), 0);

        setStats({
          totalRooms: rooms.length,
          emptyRooms,
          rentedRooms,
          totalContracts: contractsResponse.count,
          activeContracts,
          totalRevenue,
        });

        setRecentContracts(contracts.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tổng quan</h1>
        <p>Chào mừng bạn đến với hệ thống quản lý phòng trọ</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalRooms}</h3>
            <p>Tổng số phòng</p>
            <div className="stat-detail">
              <span className="stat-item">
                <span className="dot green"></span>
                {stats.emptyRooms} trống
              </span>
              <span className="stat-item">
                <span className="dot orange"></span>
                {stats.rentedRooms} đã thuê
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalContracts}</h3>
            <p>Tổng hợp đồng</p>
            <div className="stat-detail">
              <span className="stat-item">
                <span className="dot green"></span>
                {stats.activeContracts} đang hiệu lực
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeContracts}</h3>
            <p>Khách thuê hiện tại</p>
            <div className="stat-detail">
              <span className="stat-item">
                <TrendingUp size={14} />
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Tổng tiền cọc</p>
            <div className="stat-detail">
              <span className="stat-item">
                <TrendingUp size={14} />
                Từ hợp đồng hiện tại
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Thao tác nhanh</h2>
        <div className="action-cards">
          <Link to="/rooms" className="action-card">
            <Building size={20} />
            <span>Quản lý phòng</span>
          </Link>
          <Link to="/contracts" className="action-card">
            <FileText size={20} />
            <span>Quản lý hợp đồng</span>
          </Link>
          <Link to="/rooms?action=create" className="action-card primary">
            <Plus size={20} />
            <span>Thêm phòng mới</span>
          </Link>
          <Link to="/contracts?action=create" className="action-card primary">
            <Plus size={20} />
            <span>Tạo hợp đồng mới</span>
          </Link>
        </div>
      </div>

      {/* Recent Contracts */}
      <div className="recent-contracts">
        <div className="section-header">
          <h2>Hợp đồng gần đây</h2>
          <Link to="/contracts" className="view-all">
            Xem tất cả
          </Link>
        </div>

        {recentContracts.length > 0 ? (
          <div className="contracts-table">
            <table>
              <thead>
                <tr>
                  <th>Phòng</th>
                  <th>Khách thuê</th>
                  <th>Ngày bắt đầu</th>
                  <th>Tiền cọc</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentContracts.map((contract) => (
                  <tr key={contract.id}>
                    <td>{contract.room_name}</td>
                    <td>{contract.tenant_name}</td>
                    <td>
                      {new Date(contract.start_date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td>{formatCurrency(parseFloat(contract.deposit))}</td>
                    <td>{getStatusBadge(contract.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FileText size={48} />
            <h3>Chưa có hợp đồng nào</h3>
            <p>Bắt đầu bằng cách tạo hợp đồng đầu tiên</p>
            <Link to="/contracts?action=create" className="btn btn-primary">
              Tạo hợp đồng mới
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
