import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AlertTriangle, X } from 'lucide-react'
import { usePatient } from '../../hooks/usePatient'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()
  const { storageError, clearStorageError } = usePatient()

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="lg:pl-72">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {storageError ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="flex-1">{storageError}</p>
              <button
                type="button"
                onClick={clearStorageError}
                className="rounded-lg p-1 text-amber-600 transition hover:bg-amber-100"
                aria-label="Dismiss storage warning"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}

          <Outlet />
        </main>

        <footer className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 pb-8 text-[11px] text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>UniHealth · Patient health record & diagnostic history</p>
          <p>Phase 1 prototype · local browser storage</p>
        </footer>
      </div>
    </div>
  )
}
