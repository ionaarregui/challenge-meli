import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BreadCrumb from '../components/BreadCrumb'
import { useBreadcrumb } from '../contexts/BreadcrumContext'
import { SearchProvider } from '../contexts/SearchContext'
import styles from './Layout.module.scss'

export default function Layout() {
  const { breadcrumb } = useBreadcrumb()
  return (
    <SearchProvider>
      <div className={styles.layout}>
        <Header />
        <main className={styles.main}>
          <BreadCrumb steps={breadcrumb} />
          <Outlet />
        </main>
        <Footer />
      </div>
    </SearchProvider>
  )
}
