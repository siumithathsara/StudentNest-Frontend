import { Link, Navigate } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import AuthIllustration from "../components/AuthIllustration"
import { useAuth } from "../hooks/useAuth"

const hero = {
  STUDENT: {
    label: "For students",
    title: "Find a boarding near your campus",
    text: "Search approved boardings, see the distance and travel time to your campus, and request a room.",
    cta: "Search boardings",
    to: "/boardings" as string | null
  },
  OWNER: {
    label: "For boarding owners",
    title: "List your boarding for students",
    text: "Add your boarding with photos, get it approved, and receive booking requests from students.",
    cta: "Add a boarding",
    to: "/owner/boardings/new" as string | null
  }
}

const cards = {
  OWNER: [
    { title: "My boardings", text: "Add and manage your boarding listings.", to: "/owner/boardings" as string | null },
    { title: "Booking requests", text: "Approve or reject requests from students.", to: null as string | null }
  ],
  STUDENT: [
    { title: "Find a boarding", text: "Search near your campus with distance and travel time.", to: "/boardings" as string | null},
    { title: "My bookings", text: "Track the requests you have sent.", to: null as string | null },
    { title: "Favorites", text: "Save the boardings you like and compare them.", to:"/favorites" as string | null }
  ]
}

const Home = () => {
  const { user } = useAuth()

  if (!user) return null

  if (user.role === "ADMIN") return <Navigate to="/admin" replace />

  const h = hero[user.role]

  return (
    <AppLayout>
      <p className="text-nest-300">
        Welcome back, <span className="font-semibold text-sand-100">{user.name}</span>.
      </p>

   
      <section className="mt-4 overflow-hidden rounded-3xl bg-nest-800">
        <div className="grid items-center gap-6 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sand-400">{h.label}</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-sand-100 sm:text-4xl">{h.title}</h1>
            <p className="mt-3 max-w-lg text-nest-300">{h.text}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {h.to ? (
                <Link
                  to={h.to}
                  className="rounded-xl bg-sand-400 px-5 py-3 font-semibold text-nest-950 transition hover:bg-sand-500"
                >
                  {h.cta}
                </Link>
              ) : (
                <>
                  <button
                    disabled
                    className="cursor-not-allowed rounded-xl bg-sand-400 px-5 py-3 font-semibold text-nest-950 opacity-60"
                  >
                    {h.cta}
                  </button>
                  <span className="rounded-full bg-nest-700 px-3 py-1 text-xs font-semibold text-nest-100">Coming soon</span>
                </>
              )}
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <AuthIllustration className="w-full max-w-sm" />
          </div>
        </div>
      </section>

   
      <h2 className="mt-10 text-xl font-bold text-sand-100">What you can do here</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards[user.role].map((c) => {
          const body = (
            <>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-nest-600">{c.text}</p>
              {c.to ? (
                <span className="mt-3 inline-block text-sm font-semibold text-nest-800">Open →</span>
              ) : (
                <span className="mt-3 inline-block rounded-full bg-sand-300 px-2.5 py-0.5 text-xs font-semibold text-nest-950">
                  Coming soon
                </span>
              )}
            </>
          )

          const cls = "rounded-2xl bg-white p-5 text-nest-900 shadow"
          return c.to ? (
            <Link key={c.title} to={c.to} className={`${cls} transition hover:-translate-y-0.5`}>
              {body}
            </Link>
          ) : (
            <div key={c.title} className={cls}>
              {body}
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}

export default Home