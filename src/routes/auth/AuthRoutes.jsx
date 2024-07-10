import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

export const LoginPage = lazy(() => import('src/pages/login'));

export const AuthRoutes = () => {
  //console.log('mostrando rutas publicas auth');
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};
