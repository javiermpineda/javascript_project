import { Navigate, Route, Routes } from 'react-router-dom';
import { useCheckAuth } from 'src/hooks/useCheckAuth';
import { PrivateRoutes } from './privateRoutes';
import { AuthRoutes } from './auth';

export const AppRouter = () => {
  const status = useCheckAuth();

  if (status === 'checking') return <div>Loading...</div>;

  return (
    <Routes>
      {status === 'Authenticated' ? (
        <Route path="*" element={<PrivateRoutes />} />
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} />
      )}
      <Route path="/*" element={<Navigate to="./auth/login" />} />
    </Routes>
  );
};
