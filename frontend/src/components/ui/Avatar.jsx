import { getInitials } from '../../utils/formatters'

export default function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' }
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white shadow`} />
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold ring-2 ring-white shadow`}>
      {getInitials(name)}
    </div>
  )
}
