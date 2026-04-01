import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatDateTime = (dt) => {
  if (!dt) return '—'
  const date = typeof dt === 'string' ? parseISO(dt) : new Date(dt)
  return format(date, 'dd MMM yyyy, hh:mm a')
}

export const formatDate = (dt) => {
  if (!dt) return '—'
  const date = typeof dt === 'string' ? parseISO(dt) : new Date(dt)
  return format(date, 'dd MMM yyyy')
}

export const formatTime = (dt) => {
  if (!dt) return '—'
  const date = typeof dt === 'string' ? parseISO(dt) : new Date(dt)
  return format(date, 'hh:mm a')
}

export const formatRelative = (dt) => {
  if (!dt) return '—'
  const date = typeof dt === 'string' ? parseISO(dt) : new Date(dt)
  return formatDistanceToNow(date, { addSuffix: true })
}

export const formatCurrency = (amount) => {
  if (amount == null) return 'Free'
  return `₹${Number(amount).toFixed(0)}`
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
