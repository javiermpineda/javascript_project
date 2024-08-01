import { Navigate, Outlet, Route, Routes, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import { Suspense, lazy } from 'react';
import { useCheckAuth } from 'src/hooks/useCheckAuth';
import { useSelector } from 'react-redux';
import { PrivateRoutes } from './privateRoutes';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const OrderPage = lazy(() => import('src/pages/order'));

// // ----------------------------------------------------------------------

export default function Router() {
  //useCheckAuth();
  const { status } = useSelector((state) => state.auth);

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: <PrivateRoutes />,
          children: [
            { element: <IndexPage />, index: true },
            { path: '/', element: <IndexPage /> },
            { path: 'user', element: <UserPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'blog', element: <BlogPage /> },
            { path: 'order', element: <OrderPage /> },
          ],
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return routes;

  //   const routes = useRoutes([
  //     {
  //       path: '/',
  //       element: <DashboardLayout />,
  //       children: [
  //         {
  //           path: '/',
  //           element: (
  //             <Suspense fallback={<div>Loading...</div>}>
  //               <PrivateRoutes />
  //             </Suspense>
  //           ),
  //         },
  //       ],
  //     },
  //   ]);

  //   return routes;
  // }

  // export default function sections() {
  //   return (
  //     <>
  //       <DashboardLayout>
  //         <Routes>
  //           <Route path="*" element={<PrivateRoutes />} />
  //         </Routes>
  //       </DashboardLayout>
  //       <Routes>
  //         <Route path="/auth/*" element={<AuthRoutes />} />
  //       </Routes>
  //     </>
  //   );
}
