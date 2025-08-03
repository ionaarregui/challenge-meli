import { useRoutes } from 'react-router-dom'
import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Layout from '../Layout/Layout'
import NotFound from '../pages/NotFound'
import ErrorBoundary from '../components/Error/ErrorBoundary'

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: 'items', element: <Products /> },
      { path: 'items/:id', element: <ProductDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

function AppRoutes() {
  return useRoutes(routes)
}

export default AppRoutes
