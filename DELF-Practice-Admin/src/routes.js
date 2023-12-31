import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import GrammarsPage from './pages/GrammarsPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import PaymentPage from './pages/PaymentPage';
import ExaminationsPage from "./pages/ExaminationsPage";
import ImportPage from "./pages/ImportPage";

// ----------------------------------------------------------------------

export default function Router() {
  const auth = JSON.parse(localStorage.getItem('token'));

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: auth ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'grammars', element: <GrammarsPage /> },
        { path: 'examinations', element: <ExaminationsPage /> },
        { path: 'payment', element: <PaymentPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'import', element: <ImportPage /> },
      ],
    },
    {
      path: 'login',
      element: auth ? <Navigate to="/dashboard/app" /> : <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
