import { useState, type FormEvent } from "react"
import { Link, Navigate } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import { useAuth } from "../hooks/useAuth"
import { register } from "../service/auth"
import { getErrorMessage } from "../util/errors"
import { inputClass, labelClass, primaryButtonClass } from "../util/styles"

type AccountType = "STUDENT" | "OWNER"

const Register = () => {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" })
  const [role, setRole] = useState<AccountType>("STUDENT")
  const [error, setError] = useState("")
  const [done, setDone] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const update = (field: keyof typeof form, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        phone: role === "OWNER" ? form.phone : undefined
      })
      setDone(res.message)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }


  if (done) {
    return (
      <AuthLayout title="You're registered" subtitle={done} footer={null}>
        <Link to="/login" className={`${primaryButtonClass} block text-center`}>
          Go to login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Students find a place, owners list one. An admin approves every account."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-sand-400 hover:underline">
            Log in
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
        <div role="radiogroup" aria-label="Account type" className="grid grid-cols-2 gap-2">
          {(["STUDENT", "OWNER"] as const).map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={role === r}
              onClick={() => setRole(r)}
              className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                role === r
                  ? "border-sand-400 bg-sand-400 text-nest-950"
                  : "border-nest-300/40 text-nest-100 hover:bg-nest-800"
              }`}
            >
              {r === "STUDENT" ? "I'm a student" : "I own a boarding"}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>Full name</label>
          <input id="name" autoComplete="name" className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" type="email" autoComplete="email" placeholder="name@example.com" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" type="password" autoComplete="new-password" className={inputClass} value={form.password} onChange={(e) => update("password", e.target.value)} required />
          <p className="mt-1.5 text-xs text-nest-300">At least 8 characters, with a letter and a number.</p>
        </div>
        {role === "OWNER" && (
          <div>
            <label htmlFor="phone" className={labelClass}>Phone number</label>
            <input id="phone" type="tel" autoComplete="tel" className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
          </div>
        )}

        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register