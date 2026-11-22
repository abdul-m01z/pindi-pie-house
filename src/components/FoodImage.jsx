import { useState } from 'react'

// Shows the dish picture, or a labelled fallback when the image is missing or fails to load.
export default function FoodImage({ src, name, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`food-image food-image--fallback ${className}`}
        role="img"
        aria-label={`${name}: photo not available`}
      >
        <span aria-hidden="true">Photo coming soon</span>
      </div>
    )
  }
  return (
    <img
      className={`food-image ${className}`}
      src={src}
      alt={`Illustration of ${name}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
