import { Link, Navigate } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import AuthIllustration from "../components/AuthIllustration"
import { useAuth } from "../hooks/useAuth"
import StudentHome from "./StudentHome"

const ownerCards = [
  { title: "My boardings", text: "Add and manage your boarding listings.", to: "/owner/boardings" },
  { title: "Booking requests", text: "Approve or reject requests from students.", to: "/owner/bookings" }
]

const Home = () => {
  const { user } = useAuth()

  if (!user) return null
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />
  if (user.role === "STUDENT") return <StudentHome />

  // owner
  return (
    <AppLayout>
      <p className="text-nest-300">
        Welcome back, <span className="font-semibold text-sand-100">{user.name}</span>.
      </p>

      <section className="mt-4 overflow-hidden rounded-3xl bg-nest-800">
        <div className="grid items-center gap-6 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sand-400">For boarding owners</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-sand-100 sm:text-4xl">
              List your boarding for students
            </h1>
            <p className="mt-3 max-w-lg text-nest-300">
              Add your boarding with photos, get it approved, and receive booking requests from students.
            </p>

            <div className="mt-6">
              <Link
                to="/owner/boardings/new"
                className="inline-block rounded-xl bg-sand-400 px-5 py-3 font-semibold text-nest-950 transition hover:bg-sand-500"
              >
                Add a boarding
              </Link>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <AuthIllustration className="w-full max-w-sm" />
          </div>
        </div>
      </section>

      <h2 className="mt-10 text-xl font-bold text-sand-100">What you can do here</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ownerCards.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="rounded-2xl bg-white p-5 text-nest-900 shadow transition hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-nest-600">{c.text}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-nest-800">Open →</span>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}

export default Home