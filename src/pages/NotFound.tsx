import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">🏠</div>
        <h1>404</h1>
        <h2>Trang không tìm thấy</h2>
        <p>Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>

        <div className="not-found-actions">
          <Link to="/demo" className="btn-primary">
            Về trang Demo
          </Link>
          <Link to="/login" className="btn-outline">
            Đăng nhập
          </Link>
        </div>

        <div className="not-found-suggestions">
          <h3>Có thể bạn muốn:</h3>
          <ul>
            <li>
              <Link to="/demo">Trải nghiệm Demo</Link>
            </li>
            <li>
              <Link to="/login">Đăng nhập hệ thống</Link>
            </li>
            <li>
              <Link to="/register">Đăng ký tài khoản</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
