import { Link, NavLink } from 'react-router-dom'
import {
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react'
import { usePatient } from '../../hooks/usePatient'
import { getInitials } from '../../lib/people'
import { buttonClasses } from '../ui/Button'
import StorageMeter from '../ui/StorageMeter'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/treatments', label: 'Treatment records', icon: ClipboardList },
]

export default function Sidebar({ open, onClose }) {
  const { patient } = usePatient()

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 text-slate-300 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold tracking-tight text-white">
              UniHealth
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Patient workspace
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3">
          <Link
            to="/treatments?new=1"
            className={buttonClasses({
              variant: 'primary',
              size: 'md',
              className: 'w-full',
            })}
          >
            <Plus className="h-4 w-4" />
            Add treatment
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-sm font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                {getInitials(patient.fullName)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {patient.fullName}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  @{patient.username}
                </p>
              </div>
            </div>
            <StorageMeter />
          </div>

          <p className="mt-4 flex items-center gap-2 px-2 text-[10px] leading-4 text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            Local-first · records stay in this browser
          </p>
        </div>
      </aside>
    </>
  )
}
