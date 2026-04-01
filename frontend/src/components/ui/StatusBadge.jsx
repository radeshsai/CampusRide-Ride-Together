export default function StatusBadge({ status }) {
  const map = {
    ACTIVE:    { cls: 'badge-green',  label: 'Active' },
    CONFIRMED: { cls: 'badge-green',  label: 'Confirmed' },
    COMPLETED: { cls: 'badge-blue',   label: 'Completed' },
    CANCELLED: { cls: 'badge-red',    label: 'Cancelled' },
    INACTIVE:  { cls: 'badge-slate',  label: 'Inactive' },
  }
  const { cls, label } = map[status] || { cls: 'badge-slate', label: status }
  return <span className={cls}>{label}</span>
}
