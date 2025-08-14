import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/admin" className="brand-link">
              <span className="brand-icon">⚙️</span>
              <span className="brand-text">QLPT - Admin</span>
            </Link>
          </div>

          <div className="navbar-menu">
            <Link
              to="/admin"
              className={`nav-link ${isActivePath("/admin") ? "active" : ""}`}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/rooms"
              className={`nav-link ${
                isActivePath("/admin/rooms") ? "active" : ""
              }`}
            >
              <span className="nav-icon">🏠</span>
              <span>Quản lý phòng</span>
            </Link>
            <Link
              to="/admin/contracts"
              className={`nav-link ${
                isActivePath("/admin/contracts") ? "active" : ""
              }`}
            >
              <span className="nav-icon">📋</span>
              <span>Quản lý hợp đồng</span>
            </Link>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar admin">
                <span>{user?.full_name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{user?.full_name}</span>
                <span className="user-role">Quản lý</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="admin-main">
        <div className="main-container">{children}</div>
      </main>

      <footer className="admin-footer">
        <div className="footer-container">
          <p>
            &copy; 2024 Hệ thống Quản lý Phòng Trọ. Bảng điều khiển quản lý.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
