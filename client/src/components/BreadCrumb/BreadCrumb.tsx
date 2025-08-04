import styles from './BreadCrumb.module.scss'
import { useNavigate } from 'react-router-dom'
interface PropsBreadCrumb {
  steps: string[]
}

export default function BreadCrumb({ steps }: PropsBreadCrumb) {
  const navigate = useNavigate()

  const handleClick = (step: string) => {
    navigate(`/items?search=${step}`)
  }

  return (
    <div className={styles.breadcrumb}>
      {steps.map((step, index) => (
        <span
          className={styles['breadcrumb-step']}
          key={index}
          onClick={() => handleClick(step)}
        >
          {step}
          {index < steps.length - 1 && ' > '}
        </span>
      ))}
    </div>
  )
}
