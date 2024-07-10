import { CircularProgress } from '@mui/material';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ProductsPage = lazy(() => import('src/pages/products'));

export const PrivateRoutes = () => {
  //console.log('mostrando rutas privadas ');
  return (
    <DashboardLayout>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
};
