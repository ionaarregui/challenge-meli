import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/routes'
import { BreadcrumbProvider } from './contexts/BreadcrumContext'

export default function App() {
  return (
    <BrowserRouter>
      <BreadcrumbProvider>
        <AppRoutes />
      </BreadcrumbProvider>
    </BrowserRouter>
  )
}
