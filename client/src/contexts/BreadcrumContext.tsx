import { createContext, useContext, useState } from 'react'

type Breadcrumb = string[]
type BreadcrumbContextType = {
  breadcrumb: Breadcrumb
  setBreadcrumb: (b: Breadcrumb) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
)

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>([])
  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (!context)
    throw new Error('useBreadcrumb debe usarse dentro de BreadcrumbProvider')
  return context
}
