import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DemoLogin: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<"OWNER" | "TENANT">(
    "TENANT"
  );
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    // Simulate login with demo data
    const demoUser = {
      id: 1,
      email: selectedRole === "TENANT" ? "tenant@demo.com" : "admin@demo.com",
      full_name:
        selectedRole === "TENANT" ? "Nguyễn Văn A" : "Quản lý hệ thống",
      role: selectedRole,
    };

    // Store demo data
    localStorage.setItem("access_token", "demo-token");
    localStorage.setItem("user", JSON.stringify(demoUser));

    // Redirect based on role
    const redirectPath = selectedRole === "TENANT" ? "/tenant" : "/admin";
    navigate(redirectPath, { replace: true });
    window.location.reload(); // Force reload to update auth context
  };

  return (
    <div className="demo-login-container">
      <div className="demo-login-card">
        <div className="demo-header">
          <h1>🏠 QLPT - Demo Login</h1>
          <p>Chọn vai trò để trải nghiệm hệ thống</p>
        </div>

        <div className="role-selection">
          <h3>Chọn vai trò:</h3>
          <div className="role-options">
            <button
              className={`role-option ${
                selectedRole === "TENANT" ? "active" : ""
              }`}
              onClick={() => setSelectedRole("TENANT")}
            >
              <div className="role-icon">👤</div>
              <div className="role-info">
                <h4>Người thuê (TENANT)</h4>
                <p>Xem hợp đồng, tìm phòng trống</p>
              </div>
            </button>

            <button
              className={`role-option ${
                selectedRole === "OWNER" ? "active" : ""
              }`}
              onClick={() => setSelectedRole("OWNER")}
            >
              <div className="role-icon">⚙️</div>
              <div className="role-info">
                <h4>Quản lý (OWNER)</h4>
                <p>Quản lý phòng, hợp đồng, hệ thống</p>
              </div>
            </button>
          </div>
        </div>

        <button className="demo-login-btn" onClick={handleDemoLogin}>
          Đăng nhập với vai trò{" "}
          {selectedRole === "TENANT" ? "Người thuê" : "Quản lý"}
        </button>

        <div className="demo-features">
          <h4>Tính năng demo:</h4>
          {selectedRole === "TENANT" ? (
            <ul>
              <li>✅ Xem dashboard cá nhân</li>
              <li>✅ Quản lý hợp đồng thuê</li>
              <li>✅ Tìm kiếm phòng trống</li>
              <li>✅ Giao diện thân thiện</li>
            </ul>
          ) : (
            <ul>
              <li>✅ Dashboard quản lý tổng quan</li>
              <li>✅ Quản lý phòng và hợp đồng</li>
              <li>✅ Thống kê và báo cáo</li>
              <li>✅ Giao diện quản trị</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;
