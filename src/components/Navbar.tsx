import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Building, FileText, User, LogOut, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", label: "Trang chủ", icon: Home },
    { path: "/rooms", label: "Quản lý phòng", icon: Building },
    { path: "/contracts", label: "Hợp đồng", icon: FileText },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Building className="navbar-brand-icon" />
          <span>QLPT</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-item ${isActive(item.path) ? "active" : ""}`}
              >
                <IconComponent size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="navbar-user">
          <div className="user-info">
            <User size={18} />
            <span>{user?.full_name}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-menu-item ${
                  isActive(item.path) ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <IconComponent size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button onClick={handleLogout} className="mobile-logout-btn">
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
