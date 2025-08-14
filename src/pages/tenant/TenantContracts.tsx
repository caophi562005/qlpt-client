import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Contract } from "../../types";

// Fake data cho demo
const fakeContracts: Contract[] = [
  {
    id: 1,
    room: 101,
    room_name: "Phòng A101",
    tenant: 1,
    tenant_name: "Nguyễn Văn A",
    start_date: "2024-01-15",
    end_date: "2024-12-15",
    deposit: "9000000",
    billing_cycle: "MONTHLY",
    status: "ACTIVE",
  },
  {
    id: 2,
    room: 205,
    room_name: "Phòng D301",
    tenant: 1,
    tenant_name: "Nguyễn Văn A",
    start_date: "2023-06-01",
    end_date: "2023-12-31",
    deposit: "12000000",
    billing_cycle: "MONTHLY",
    status: "ENDED",
  },
];

const TenantContracts: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "ended">("active");

  useEffect(() => {
    // Simulate API call to get user's contracts
    const userContracts = fakeContracts.filter(
      (contract) => contract.tenant_name === user?.full_name
    );
    setContracts(userContracts);
  }, [user]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseInt(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeContracts = contracts.filter((c) => c.status === "ACTIVE");
  const endedContracts = contracts.filter((c) => c.status === "ENDED");

  const ContractCard: React.FC<{ contract: Contract }> = ({ contract }) => {
    const daysRemaining = contract.end_date
      ? getDaysRemaining(contract.end_date)
      : null;

    return (
      <div className={`contract-card ${contract.status.toLowerCase()}`}>
        <div className="contract-header">
          <div className="contract-title">
            <h3>{contract.room_name}</h3>
            <span className={`status-badge ${contract.status.toLowerCase()}`}>
              {contract.status === "ACTIVE" ? "Đang thuê" : "Đã kết thúc"}
            </span>
          </div>
          {contract.status === "ACTIVE" && daysRemaining !== null && (
            <div
              className={`days-remaining ${
                daysRemaining <= 30 ? "warning" : ""
              }`}
            >
              {daysRemaining > 0
                ? `${daysRemaining} ngày còn lại`
                : "Đã hết hạn"}
            </div>
          )}
        </div>

        <div className="contract-body">
          <div className="contract-details-grid">
            <div className="detail-group">
              <h4>Thời gian thuê</h4>
              <div className="detail-item">
                <span className="label">Ngày bắt đầu:</span>
                <span className="value">{formatDate(contract.start_date)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Ngày kết thúc:</span>
                <span className="value">
                  {contract.end_date
                    ? formatDate(contract.end_date)
                    : "Chưa xác định"}
                </span>
              </div>
            </div>

            <div className="detail-group">
              <h4>Thông tin tài chính</h4>
              <div className="detail-item">
                <span className="label">Tiền cọc:</span>
                <span className="value price">
                  {formatPrice(contract.deposit)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Chu kỳ thanh toán:</span>
                <span className="value">
                  {contract.billing_cycle === "MONTHLY"
                    ? "Hàng tháng"
                    : "Hàng quý"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="contract-actions">
          <button className="btn-outline">Xem chi tiết</button>
          {contract.status === "ACTIVE" && (
            <>
              <button className="btn-secondary">Gia hạn hợp đồng</button>
              <button className="btn-danger">Yêu cầu kết thúc</button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tenant-contracts">
      <div className="page-header">
        <h1>Hợp đồng của tôi</h1>
        <p className="page-subtitle">
          Quản lý và theo dõi các hợp đồng thuê phòng
        </p>
      </div>

      <div className="contracts-tabs">
        <button
          className={`tab-button ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Đang thuê ({activeContracts.length})
        </button>
        <button
          className={`tab-button ${activeTab === "ended" ? "active" : ""}`}
          onClick={() => setActiveTab("ended")}
        >
          Đã kết thúc ({endedContracts.length})
        </button>
      </div>

      <div className="contracts-content">
        {activeTab === "active" && (
          <div className="contracts-list">
            {activeContracts.length > 0 ? (
              activeContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>Chưa có hợp đồng đang thuê</h3>
                <p>
                  Bạn hiện tại chưa có hợp đồng thuê phòng nào đang hoạt động
                </p>
                <button className="btn-primary">Tìm phòng trống</button>
              </div>
            )}
          </div>
        )}

        {activeTab === "ended" && (
          <div className="contracts-list">
            {endedContracts.length > 0 ? (
              endedContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>Chưa có hợp đồng đã kết thúc</h3>
                <p>Bạn chưa có hợp đồng thuê phòng nào đã kết thúc</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantContracts;
