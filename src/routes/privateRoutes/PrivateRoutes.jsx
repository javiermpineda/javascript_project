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
          <Route path="laundry" element={<LaundryPage />} />
          <Route path="codes" element={<CodesPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
};
