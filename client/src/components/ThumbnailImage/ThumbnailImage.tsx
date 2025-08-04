import styles from './ThumbnailImage.module.scss'

export default function ThumbnailImage({
  imageUrl,
  alt,
  isActive,
  size = 44,
}: {
  imageUrl: string
  alt: string
  size?: number
  isActive?: boolean
}) {
  return (
    <div
      className={`${styles.thumbnail} ${isActive ? styles.active : ''}`}
      style={{ width: size, height: size }}
    >
      <img src={imageUrl} alt={alt} />
    </div>
  )
}
