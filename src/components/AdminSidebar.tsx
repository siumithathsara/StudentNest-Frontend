import { Link, NavLink } from "react-router-dom"
import { CloseIcon } from "./icons"
import Logo from "./Logo"
import { navItems } from "./navItems"

type AdminSidebarProps = {
  open: boolean 
  onClose: () => void
}

const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => (
  <>

    {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-hidden="true" />}

    <aside
      aria-label="Sidebar"
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-nest-600 bg-nest-900 transition-transform duration-200 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-5">
        <Link to="/admin" onClick={onClose} aria-label="StudentNest dashboard">
          <Logo size="sm" />
        </Link>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-lg p-2 text-nest-100 hover:bg-nest-800 lg:hidden"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-nest-300/70">Administration</p>

        {navItems.ADMIN.map((item) => {
          const Icon = item.icon

          if (item.soon) {
            return (
              <div
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-nest-300/60"
              >
                <Icon />
                <span className="flex-1">{item.label}</span>
                <span className="rounded-full bg-nest-800 px-2 py-0.5 text-[11px] font-semibold text-nest-300">Soon</span>
              </div>
            )
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-nest-700 text-sand-400" : "text-nest-100 hover:bg-nest-800"
                }`
              }
            >
              <Icon />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <p className="px-5 py-4 text-xs text-nest-300/70">© StudentNest</p>
    </aside>
  </>
)

export default AdminSidebar