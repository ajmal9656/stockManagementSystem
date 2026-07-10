import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

import Product from "../components/product/Product";
import Store from "../components/store/Store";
import Stock from "../components/stock/Stock";

import ProtectedRoute from "../components/layout/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/products" element={<Product />} />
            <Route path="/stores" element={<Store />} />
            <Route path="/stock" element={<Stock />} />
          </Route>
        </Route>

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;