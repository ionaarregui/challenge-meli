interface StarIconProps {
  filled: boolean
  halfFilled: boolean
}

export default function StarIcon({ filled, halfFilled }: StarIconProps) {
  if (halfFilled) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        data-testid="star-icon"
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#halfStar)"
          stroke="#3483fa"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="halfStar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#3483fa" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      data-testid="star-icon"
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? '#3483fa' : 'none'}
        stroke="#3483fa"
        strokeWidth="1.5"
      />
    </svg>
  )
}
