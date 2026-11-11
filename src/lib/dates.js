const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function pad(value) {
  return String(value).padStart(2, '0')
}

function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value) {
  const date = toDate(value)
  return date ? dateFormatter.format(date) : 'Not set'
}

export function formatTime(value) {
  const date = toDate(value)
  return date ? timeFormatter.format(date) : '—'
}

export function formatDateTime(value) {
  const date = toDate(value)
  return date ? dateTimeFormatter.format(date) : 'Not set'
}

export function formatDateOnly(value) {
  if (!value) return 'Not set'

  const parts = String(value).split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return formatDate(value)

  return dateFormatter.format(new Date(parts[0], parts[1] - 1, parts[2]))
}

export function toDateTimeInput(value) {
  const date = toDate(value)
  if (!date) return ''

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function toDateTimeLocalValue(date = new Date()) {
  return toDateTimeInput(date)
}

export function formatDuration(startTime, endTime) {
  const start = toDate(startTime)
  const end = toDate(endTime)
  if (!start || !end) return 'Not available'

  const minutes = Math.round((end.getTime() - start.getTime()) / 60000)
  if (minutes <= 0) return 'Less than a minute'
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours < 24) {
    return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`
}

export function getTreatmentStatus(startTime, endTime, now = new Date()) {
  const start = toDate(startTime)
  const end = toDate(endTime)

  if (!start || !end) return { label: 'Unknown', tone: 'slate' }
  if (now < start) return { label: 'Scheduled', tone: 'sky' }
  if (now <= end) return { label: 'Ongoing', tone: 'amber' }

  return { label: 'Completed', tone: 'emerald' }
}
