import { currencyMapper } from '../../common/mappers'
import type { Price } from '../../types/Product'
import styles from './AmountLabel.module.scss'

type AmountLabelProps = Price & {
  showNotTax?: boolean
  style?: React.CSSProperties
}

export default function AmountLabel({
  currency,
  amount,
  decimals,
  showNotTax,
  style,
}: AmountLabelProps) {
  const value = decimals > 0 ? amount / Math.pow(10, decimals) : amount
  const formattedAmount = value.toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  const amoutText = `${currencyMapper[currency].symbol} ${formattedAmount}`

  return (
    <>
      <p className={styles.amount} style={style}>
        {amoutText}
      </p>
      {showNotTax && (
        <p className={styles.taxLeyend}>
          Precio sin impuestos nacionales:
          <span>
            {` ${currencyMapper[currency].symbol} ${formattedAmount}`}
          </span>
        </p>
      )}
    </>
  )
}
