import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface TenantLayoutProps {
  children: React.ReactNode;
}

const TenantLayout: React.FC<TenantLayoutProps> = ({ children }) => {
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
    <div className="tenant-layout">
      <nav className="tenant-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/tenant" className="brand-link">
              <span className="brand-icon">🏠</span>
              <span className="brand-text">QLPT - Tenant</span>
            </Link>
          </div>

          <div className="navbar-menu">
            <Link
              to="/tenant"
              className={`nav-link ${isActivePath("/tenant") ? "active" : ""}`}
            >
              <span className="nav-icon">🏠</span>
              <span>Trang chủ</span>
            </Link>
            <Link
              to="/tenant/contracts"
              className={`nav-link ${
                isActivePath("/tenant/contracts") ? "active" : ""
              }`}
            >
              <span className="nav-icon">📋</span>
              <span>Hợp đồng</span>
            </Link>
            <Link
              to="/tenant/rooms"
              className={`nav-link ${
                isActivePath("/tenant/rooms") ? "active" : ""
              }`}
            >
              <span className="nav-icon">🔍</span>
              <span>Phòng trống</span>
            </Link>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                <span>{user?.full_name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{user?.full_name}</span>
                <span className="user-role">Người thuê</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="tenant-main">
        <div className="main-container">{children}</div>
      </main>

      <footer className="tenant-footer">
        <div className="footer-container">
          <p>
            &copy; 2024 Hệ thống Quản lý Phòng Trọ. Dành cho người thuê phòng.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TenantLayout;
