# QLPT - Hệ thống Quản lý Phòng Trọ

## 🏠 Tổng quan

Hệ thống Quản lý Phòng Trọ (QLPT) là một ứng dụng web hiện đại được xây dựng với React + TypeScript, cung cấp giải pháp quản lý toàn diện cho việc thuê phòng trọ.

## ✨ Tính năng chính

### 👤 Dành cho Người thuê (TENANT)

- **Dashboard cá nhân**: Xem thông tin tổng quan về hợp đồng hiện tại
- **Quản lý hợp đồng**: Xem chi tiết hợp đồng đang thuê và đã kết thúc
- **Tìm phòng trống**: Duyệt và lọc các phòng còn trống với thông tin chi tiết
- **Giao diện thân thiện**: UI/UX được thiết kế tối ưu cho người dùng cuối

### ⚙️ Dành cho Quản lý (OWNER/ADMIN)

- **Dashboard quản lý**: Thống kê tổng quan về hệ thống
- **Quản lý phòng**: CRUD operations cho phòng trọ
- **Quản lý hợp đồng**: Theo dõi và quản lý tất cả hợp đồng
- **Giao diện quản trị**: UI chuyên nghiệp cho việc quản lý

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: CSS3 với design hiện đại
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js >= 16.0.0
- npm >= 8.0.0

### Các bước cài đặt

1. **Clone repository**

```bash
git clone <repository-url>
cd qlpt-client
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Chạy development server**

```bash
npm run dev
```

4. **Truy cập ứng dụng**
   - Mở browser và truy cập: `http://localhost:5174`
   - Để demo, truy cập: `http://localhost:5174/demo`

## 🎮 Hướng dẫn sử dụng Demo

### Truy cập Demo

Truy cập `/demo` để sử dụng tính năng demo với dữ liệu mẫu.

### Chọn vai trò

1. **Người thuê (TENANT)**: Trải nghiệm giao diện người dùng cuối
2. **Quản lý (OWNER)**: Trải nghiệm giao diện quản trị

### Dữ liệu mẫu

- **Phòng**: 10 phòng với các trạng thái khác nhau (trống, đã thuê, bảo trì)
- **Hợp đồng**: 3 hợp đồng mẫu (hoạt động và đã kết thúc)
- **Người dùng**: 3 người dùng với các vai trò khác nhau

## 📁 Cấu trúc dự án

```
src/
├── components/           # Shared components
│   ├── AdminLayout.tsx   # Layout cho admin
│   ├── TenantLayout.tsx  # Layout cho tenant
│   ├── Layout.tsx        # Layout gốc
│   ├── Navbar.tsx        # Navigation bar
│   └── ProtectedRoute.tsx # Route protection
├── pages/               # Page components
│   ├── tenant/          # Trang dành cho tenant
│   │   ├── TenantDashboard.tsx
│   │   ├── TenantContracts.tsx
│   │   └── TenantRooms.tsx
│   ├── Login.tsx        # Trang đăng nhập chính
│   ├── DemoLogin.tsx    # Trang demo login
│   ├── Dashboard.tsx    # Admin dashboard
│   ├── Rooms.tsx        # Quản lý phòng
│   └── Contracts.tsx    # Quản lý hợp đồng
├── context/            # React contexts
│   └── AuthContext.tsx # Authentication context
├── services/           # API & data services
│   ├── api.ts         # API service
│   └── fakeData.ts    # Demo data service
├── styles/            # CSS files
│   ├── tenant.css     # Tenant styles
│   ├── tenant-contracts.css
│   ├── tenant-rooms.css
│   ├── admin.css      # Admin styles
│   └── demo-login.css # Demo login styles
├── types/             # TypeScript type definitions
│   └── index.ts
└── utils/             # Utility functions
```

## 🎨 Design System

### Màu sắc chính

- **Tenant theme**: Gradient tím xanh (#667eea → #764ba2)
- **Admin theme**: Gradient xám đen (#1e293b → #334155)
- **Success**: #059669
- **Warning**: #d97706
- **Danger**: #dc2626

### Typography

- **Headers**: Gradient text với fonts chữ đậm
- **Body**: Hệ thống fonts readable với contrast tốt
- **UI Text**: Font weight và size được tối ưu cho UX

### Layout

- **Responsive**: Mobile-first design
- **Grid system**: CSS Grid cho layout phức tạp
- **Cards**: Card-based design với shadows và hover effects
- **Animations**: Smooth transitions và micro-animations

## 🗺️ Routing Structure

```
/                    → Redirect based on role
/demo               → Demo login page
/login              → Main login page
/register           → Registration page

# Tenant Routes (prefix: /tenant)
/tenant             → Tenant dashboard
/tenant/contracts   → Tenant contracts management
/tenant/rooms       → Available rooms for rent

# Admin Routes (prefix: /admin)
/admin              → Admin dashboard
/admin/rooms        → Room management
/admin/contracts    → Contract management
```

## 📊 Dữ liệu mẫu

### Phòng (Rooms)

- Tổng: 10 phòng
- Trống: 6 phòng
- Đã thuê: 2 phòng
- Bảo trì: 1 phòng
- Diện tích: 22-40 m²
- Giá thuê: 4.2M - 7M VNĐ/tháng

### Hợp đồng (Contracts)

- Hoạt động: 2 hợp đồng
- Đã kết thúc: 1 hợp đồng
- Chu kỳ thanh toán: Hàng tháng
- Tiền cọc: 8.6M - 12M VNĐ

### Người dùng (Users)

- Tenant: Nguyễn Văn A, Trần Thị B
- Owner: Quản lý hệ thống

## 🔒 Bảo mật

- **Route Protection**: Bảo vệ routes dựa trên role
- **Role-based Access**: Phân quyền theo vai trò người dùng
- **Local Storage**: Lưu trữ token và user info an toàn
- **Input Validation**: Validate dữ liệu đầu vào

## 🚀 Deployment

### Build production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint code

```bash
npm run lint
```

## 📝 TODO / Tính năng tương lai

- [ ] Tích hợp backend API thực tế
- [ ] Hệ thống thanh toán online
- [ ] Notification system
- [ ] Chat support
- [ ] Mobile app
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Export/Import data
- [ ] Advanced analytics
- [ ] Email notifications

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

Project Link: [https://github.com/caophi562005/qlpt-client](https://github.com/caophi562005/qlpt-client)

---

⭐ **Nếu project hữu ích, hãy cho một star nhé!** ⭐
