import { CircularProgress } from '@mui/material';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';


export const IndexPage = lazy(() => import('src/pages/app'));
export const CodesPage = lazy(() => import('src/pages/codes'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LaundryPage = lazy(() => import('src/pages/laundry'));
export const AdminSettings = lazy(() => import('src/pages/adminSettings'));
export const AdminProfile = lazy(() => import('src/pages/adminProfile'));
export const Client = lazy(() => import('src/pages/client'));
export const EditClient = lazy(() => import('src/pages/editClient'));
export const AddClient = lazy(() => import('src/pages/addClient'));
export const ClockInClockOut = lazy(() => import('src/pages/clockInClockOut'));
export const OrderPage = lazy(() => import('src/pages/order'));
export const OrderCreatePage = lazy(() => import('src/pages/orderCreate'));
export const OrderEditPage = lazy(() => import('src/pages/orderEdit'));
export const OrderFinalizePage = lazy(() => import('src/pages/orderFinalize'));
export const OrderReception = lazy(() => import('src/pages/orderReception'));

export const PrivateRoutes = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/client" element={<Client />} />
          <Route path="/admin/editClient/:id" element={<EditClient />} />
          <Route path="/admin/addClient/" element={<AddClient />} />
          <Route path="/admin/clockInClockOut/" element={<ClockInClockOut />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="order/add" element={<OrderCreatePage />} />
          <Route path="order/edit/:id" element={<OrderEditPage />} />
          <Route path="order/finalize/:id" element={<OrderFinalizePage />} />
          <Route path="orderreception" element={<OrderReception />} />
          <Route path="laundry" element={<LaundryPage />} />
          <Route path="codes" element={<CodesPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
};
