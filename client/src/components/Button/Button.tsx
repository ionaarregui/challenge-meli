import React from 'react'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  )
}
