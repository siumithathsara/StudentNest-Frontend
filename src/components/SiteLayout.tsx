import type { ReactNode } from "react"
import Logo from "./Logo"
import SiteNavbar from "./SiteNavbar"

const SiteLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-dvh flex-col">
    <SiteNavbar />

    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>

    <footer className="border-t border-nest-600 bg-nest-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-nest-300 sm:flex-row sm:px-6 lg:px-8">
        <Logo size="sm" />
        <p>Find your boarding near campus.</p>
        <p>© {new Date().getFullYear()} StudentNest</p>
      </div>
    </footer>
  </div>
)

export default SiteLayout