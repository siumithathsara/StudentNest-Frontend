import { useEffect, useState, type FormEvent } from "react"
import { Link, Navigate } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import PasswordInput from "../components/PasswordInput"
import { useAuth } from "../hooks/useAuth"
import { inputClass, labelClass, primaryButtonClass } from "../util/styles"

const Login = () => {
  const { user, submitting, error, login, clearError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    clearError()
  }, [clearError])

  if (user) return <Navigate to="/" replace />

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(email, password, remember)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to find and manage your boardings."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-semibold text-sand-400 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
                <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={setPassword}
            required
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-sand-400 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-nest-100">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-sand-400"
          />
          
          Keep me signed in on this device
        </label>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login