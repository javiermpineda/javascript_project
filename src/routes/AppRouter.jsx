import { Navigate, Route, Routes } from 'react-router-dom';
import { useCheckAuth } from 'src/hooks/useCheckAuth';
import { PrivateRoutes } from './privateRoutes';
import { AuthRoutes } from './auth';

export const AppRouter = () => {
  const status = 'Not-authenticated'; //useCheckAuth(); descomentar luego de pruebas cambiar status por useCheckAuth();

  if (status === 'checking') return <div>Loading...</div>;

  return (
    <Routes>
      {status === 'Not-authenticated' ? ( //cambiar status por authenticated;
        <Route path="*" element={<PrivateRoutes />} />
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} />
      )}
      <Route path="/*" element={<Navigate to="./auth/login" />} />
    </Routes>
  );
};
