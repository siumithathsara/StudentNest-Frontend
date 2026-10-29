import type { ReactNode } from "react"
import AuthIllustration from "./AuthIllustration"
import Logo from "./Logo"

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => (
  <div className="flex min-h-dvh items-center justify-center lg:p-8">
   
    <div className="grid w-full max-w-6xl overflow-hidden lg:min-h-[640px] lg:grid-cols-2 lg:rounded-3xl lg:bg-nest-800 lg:shadow-2xl">
      <main className="flex flex-col px-6 py-8 lg:px-14 lg:py-12">
        <div className="flex items-start justify-between">
          <Logo />

         
          <AuthIllustration compact className="h-28 w-auto lg:hidden" />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <h1 className="text-3xl font-bold text-sand-100">{title}</h1>
          <p className="mt-2 text-nest-300">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-nest-300">{footer}</div>
        </div>
      </main>

  
      <aside className="hidden flex-col items-center justify-center bg-nest-900 p-10 lg:flex">
        <AuthIllustration className="w-full max-w-md" />
        <h2 className="mt-8 text-center text-2xl font-bold text-sand-100">Find your boarding near campus</h2>
        <p className="mt-2 max-w-sm text-center text-nest-300">
          Search by distance, book a room, and track your requests in one place.
        </p>
      </aside>
    </div>
  </div>
)

export default AuthLayout