import Badge from '../../components/ui/Badge'
import { getTreatmentStatus } from '../../lib/dates'

const DOT_TONES = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  sky: 'bg-sky-500',
  slate: 'bg-slate-400',
}

export default function TreatmentStatus({ startTime, endTime }) {
  const status = getTreatmentStatus(startTime, endTime)

  return (
    <Badge tone={status.tone}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[status.tone] ?? DOT_TONES.slate}`}
      />
      {status.label}
    </Badge>
  )
}
