import { Link } from 'react-router-dom'
import { Menu, Plus, WifiOff } from 'lucide-react'
import { usePatient } from '../../hooks/usePatient'
import { getInitials } from '../../lib/people'
import { buttonClasses } from '../ui/Button'

export default function Topbar({ onMenuClick }) {
  const { patient } = usePatient()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            UniHealth / Patient portal
          </p>
          <p className="truncate text-sm font-semibold text-slate-700">
            Personal health record
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200 md:inline-flex">
            <WifiOff className="h-3.5 w-3.5" />
            Phase 1 · offline mode
          </span>

          <Link
            to="/treatments?new=1"
            className={buttonClasses({ size: 'sm', className: 'hidden sm:inline-flex' })}
          >
            <Plus className="h-3.5 w-3.5" />
            New treatment
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
              {getInitials(patient.fullName)}
            </span>
            <span className="hidden max-w-[150px] truncate text-xs font-semibold text-slate-700 sm:block">
              {patient.fullName}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
