import styles from './BreadCrumb.module.scss'
interface PropsBreadCrumb {
  steps: string[]
}

export default function BreadCrumb({ steps }: PropsBreadCrumb) {
  return (
    <div className={styles.breadcrumb}>
      {steps.map((step, index) => (
        <span className={styles['breadcrumb-step']} key={index}>
          {step}
          {index < steps.length - 1 && ' > '}
        </span>
      ))}
    </div>
  )
}
