import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import DashboardPage from '../../pages/admin/DashBoard/DashboardPage';
import CashregisterListPage from '../../pages/admin/CashregisterListPage/CashregisterListPage';
import EntityListPage from '../../pages/admin/EntityListPage/EntityListPage';
import LoggerListPage from '../../pages/admin/LoggerListPage/LoggerListPage';
import MailmessageListPage from '../../pages/admin/MailmessageListPage/MailmessageListPage';
import PaymentListPage from '../../pages/admin/PaymentListPage/PaymentListPage';
import SquareListPage from '../../pages/common/SquareListPage/SquareListPage';
import SquareconfigurationListPage from '../../pages/common/SquareconfigurationListPage/SquareconfigurationListPage';
import SquaresavingListPage from '../../pages/common/SquaresavingListPage/SquaresavingListPage';
import UserListPage from '../../pages/admin/UserListPage/UserListPage';
import UserentityListPage from '../../pages/admin/UserentityListPage/UserentityListPage';
import EntityCreatePage from '../../pages/common/EntityCreatePage/EntityCreatePage';
import EntityPage from '../../pages/common/EntityPage/EntityPage';
import SquarePage from '../../pages/admin/SquarePage/SquarePage';
import ProductListPage from '../../pages/common/ProductListPage/ProductListPage';
import ProductPage from '../../pages/common/ProductPage/ProductPage';

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/CashRegister" element={<CashregisterListPage />} />
      <Route path="/Empresas" element={<EntityListPage />} />
      <Route path="/Empresas/:code" element={<EntityPage />} />
      <Route path="/Empresas/adicionar" element={<EntityCreatePage />} />
      <Route path="/Empresas/editar/:code" element={<EntityCreatePage />} />
      <Route path="/Quadras" element={<SquareListPage />} />
      <Route path="/Quadras/:code" element={<SquarePage />} />
      <Route path="/Horarios" element={<SquareconfigurationListPage />} />
      <Route path="/Produtos" element={<ProductListPage />} />
      <Route path="/Produtos/:code" element={<ProductPage />} />
      <Route path="/Logger" element={<LoggerListPage />} />
      <Route path="/MailMessage" element={<MailmessageListPage />} />
      <Route path="/Payment" element={<PaymentListPage />} />
      <Route path="/Reservas" element={<SquaresavingListPage />} />
      <Route path="/Usuarios" element={<UserListPage />} />
      <Route path="/UserEntity" element={<UserentityListPage />} />
      <Route path="/*" element={<DashboardPage />} />
      </Routes>
  </AdminLayout>
);

export default AdminRoutes;

