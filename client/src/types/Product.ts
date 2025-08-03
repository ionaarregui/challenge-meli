type Currency = 'ARS' | 'USD'
type Condition = 'new' | 'used' | 'refurbished'

export interface Price {
  currency: Currency
  amount: number
  decimals: number
  withoutTax?: number
}

export interface Product {
  id: string
  title: string
  price: Price
  picture: string
  condition: Condition
  free_shipping: boolean
  rating?: Rating
}

export interface ProductsSearchResult {
  items: Product[]
  categories: string[]
}

export interface VariantOption {
  variant_value: string
  picture: string
}

export interface ProductVariant {
  variant_type: string
  variant: VariantOption[]
}

export interface Rating {
  score: number
  count: number
}

export interface ProductItem extends Product {
  categories: string[]
  mainPicture: string
  variants: ProductVariant[]
  stock: number
  sold_quantity: string
  rating: Rating
  bestPrice: boolean
  description: string
  retiro?: string
}

export interface Author {
  userName: string
  name: string
  lastname: string
  sold_quantity: string
}

export interface ProductDetail {
  author: Author
  item: ProductItem
}
