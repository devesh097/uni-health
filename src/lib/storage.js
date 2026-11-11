export const STORAGE_KEYS = Object.freeze({
  patient: 'unihealth.patient.v1',
  treatments: 'unihealth.treatments.v1',
  doctors: 'unihealth.doctors.v1',
})

export const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024

export function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  if (typeof window === 'undefined') {
    throw new Error('Browser storage is unavailable.')
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function estimateStorageBytes(value) {
  try {
    return new Blob([JSON.stringify(value)]).size
  } catch {
    return JSON.stringify(value).length * 2
  }
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB'

  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
