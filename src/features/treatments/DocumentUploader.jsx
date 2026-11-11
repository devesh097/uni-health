import { useRef, useState } from 'react'
import { FileImage, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { prepareImageFile } from '../../lib/images'
import { formatBytes } from '../../lib/storage'

const MAX_DOCUMENTS = 4

export default function DocumentUploader({
  documents = [],
  onChange,
  error,
}) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState('')

  const remainingSlots = MAX_DOCUMENTS - documents.length

  async function addFiles(fileList) {
    if (busy) return

    const files = Array.from(fileList)

    if (!files.length) return

    if (remainingSlots <= 0) {
      setLocalError(`You can attach up to ${MAX_DOCUMENTS} images per treatment.`)
      return
    }

    setBusy(true)
    setLocalError('')

    const prepared = []
    const errors = []

    for (const file of files.slice(0, remainingSlots)) {
      try {
        prepared.push(await prepareImageFile(file))
      } catch (fileError) {
        errors.push(fileError.message)
      }
    }

    if (prepared.length) {
      onChange([...documents, ...prepared].slice(0, MAX_DOCUMENTS))
    }

    if (files.length > remainingSlots) {
      errors.push(`Only ${remainingSlots} more image(s) could be attached.`)
    }

    setLocalError(errors.join(' '))
    setBusy(false)

    if (inputRef.current) inputRef.current.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  function removeDocument(documentId) {
    onChange(documents.filter((document) => document.id !== documentId))
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${
          dragging
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-slate-200 bg-slate-50/60'
        }`}
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-inset ring-slate-200">
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <UploadCloud className="h-5 w-5" />
          )}
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Drop prescription photos here or{' '}
          <button
            type="button"
            className="font-semibold text-emerald-700 underline-offset-2 hover:underline"
            onClick={() => inputRef.current?.click()}
            disabled={busy || remainingSlots <= 0}
          >
            browse files
          </button>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          JPG, PNG or WebP · up to {MAX_DOCUMENTS} images · resized for local
          storage
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>

      {localError || error ? (
        <p className="mt-2 text-xs font-medium text-rose-600">
          {localError || error}
        </p>
      ) : null}

      {documents.length ? (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {documents.map((document) => (
            <li
              key={document.id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="relative aspect-square bg-slate-100">
                <img
                  src={document.dataUrl}
                  alt={document.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeDocument(document.id)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-0 transition hover:bg-rose-600 focus:opacity-100 group-hover:opacity-100"
                  aria-label={`Remove ${document.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 p-2">
                <FileImage className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-slate-700">
                    {document.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatBytes(document.size)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
