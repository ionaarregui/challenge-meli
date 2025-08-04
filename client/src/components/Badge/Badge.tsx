import React from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  color?: 'default' | 'success' | 'info'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function Badge({
  children,
  variant = 'primary',
  color = 'default',
  size = 'medium',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${styles[color]} ${styles[size]} ${className}`}
    >
      {children}
    </span>
  )
}
