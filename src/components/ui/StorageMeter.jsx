import { usePatient } from '../../hooks/usePatient'
import { STORAGE_LIMIT_BYTES, formatBytes } from '../../lib/storage'

export default function StorageMeter({ className = '' }) {
  const { storageUsage } = usePatient()
  const percent = Math.min(
    100,
    Math.round((storageUsage / STORAGE_LIMIT_BYTES) * 100),
  )
  const barTone =
    percent > 85 ? 'bg-rose-400' : percent > 60 ? 'bg-amber-400' : 'bg-emerald-400'

  return (
    <div className={`mt-4 ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
        <span>Local storage</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${barTone}`}
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-slate-500">
        {formatBytes(storageUsage)} of {formatBytes(STORAGE_LIMIT_BYTES)} used
      </p>
    </div>
  )
}
