import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import TenantLayout from "./components/TenantLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DemoLogin from "./pages/DemoLogin";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Contracts from "./pages/Contracts";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantContracts from "./pages/tenant/TenantContracts";
import TenantRooms from "./pages/tenant/TenantRooms";
import "./styles.css";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/demo" element={<DemoLogin />} />
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate
              to={user?.role === "TENANT" ? "/tenant" : "/admin"}
              replace
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register />
          ) : (
            <Navigate
              to={user?.role === "TENANT" ? "/tenant" : "/admin"}
              replace
            />
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {user?.role === "OWNER" ? (
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            ) : (
              <Navigate to="/tenant" replace />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute>
            {user?.role === "OWNER" ? (
              <AdminLayout>
                <Rooms />
              </AdminLayout>
            ) : (
              <Navigate to="/tenant" replace />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contracts"
        element={
          <ProtectedRoute>
            {user?.role === "OWNER" ? (
              <AdminLayout>
                <Contracts />
              </AdminLayout>
            ) : (
              <Navigate to="/tenant" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Tenant Routes */}
      <Route
        path="/tenant"
        element={
          <ProtectedRoute>
            {user?.role === "TENANT" ? (
              <TenantLayout>
                <TenantDashboard />
              </TenantLayout>
            ) : (
              <Navigate to="/admin" replace />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/tenant/contracts"
        element={
          <ProtectedRoute>
            {user?.role === "TENANT" ? (
              <TenantLayout>
                <TenantContracts />
              </TenantLayout>
            ) : (
              <Navigate to="/admin" replace />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/tenant/rooms"
        element={
          <ProtectedRoute>
            {user?.role === "TENANT" ? (
              <TenantLayout>
                <TenantRooms />
              </TenantLayout>
            ) : (
              <Navigate to="/admin" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Default redirect based on user role */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? user?.role === "TENANT"
                  ? "/tenant"
                  : "/admin"
                : "/demo"
            }
            replace
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
