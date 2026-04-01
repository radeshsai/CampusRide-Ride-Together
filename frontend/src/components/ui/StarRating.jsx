import { useState } from 'react'

export default function StarRating({ value = 0, onChange, readonly = false, size = 'md' }) {
  const [hover, setHover] = useState(0)
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${sizes[size]} transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} leading-none`}
        >
          <span className={(hover || value) >= star ? 'text-amber-400' : 'text-slate-200'}>
            ★
          </span>
        </button>
      ))}
    </div>
  )
}
