import StarIcon from './StarIcon'
import styles from './Rating.module.scss'

interface RatingProps {
  rating: number
  totalReviews?: number
  showScore?: boolean
}

export default function Rating({
  rating,
  totalReviews,
  showScore = true,
}: RatingProps) {
  return (
    <div className={styles.ratingContainer}>
      {showScore && <span>{rating.toFixed(1)}</span>}
      <div className={styles.starsContainer}>
        {[...Array(5)].map((_, i) => {
          const isFilled = i < Math.floor(rating)
          const isHalfFilled = i === Math.floor(rating) && rating % 1 >= 0.5

          return (
            <StarIcon key={i} filled={isFilled} halfFilled={isHalfFilled} />
          )
        })}
      </div>
      {totalReviews && <span>{`(${totalReviews})`}</span>}
    </div>
  )
}
