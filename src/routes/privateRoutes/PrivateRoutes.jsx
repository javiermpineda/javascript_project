import { CircularProgress } from '@mui/material';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';


export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const AdminSettings = lazy(() => import('src/pages/adminSettings'));
export const AdminProfile = lazy(() => import('src/pages/adminProfile'));
export const Client = lazy(() => import('src/pages/client'));
export const EditClient = lazy(() => import('src/pages/editClient'));
export const OrderPage = lazy(() => import('src/pages/order'));

export const PrivateRoutes = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/client" element={<Client />} />
          <Route path="/admin/editClient/:id" element={<EditClient />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="order" element={<OrderPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
};
