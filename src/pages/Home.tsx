//  tempory file for checkda login 
import { Link } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import { useAuth } from "../hooks/useAuth"
import type { Role } from "../types"

const cards: Record<Role, { title: string; text: string }[]> = {
  ADMIN: [
    { title: "Approve users", text: "Review new students and owners." },
    { title: "Approve boardings", text: "Check new listings before they go live." },
    { title: "Campuses", text: "Manage the campuses students can search around." }
  ],
  OWNER: [
    { title: "My boardings", text: "Add and manage your boarding listings." },
    { title: "Booking requests", text: "Approve or reject requests from students." }
  ],
  STUDENT: [
    { title: "Find a boarding", text: "Search near your campus with distance and travel time." },
    { title: "My bookings", text: "Track the requests you have sent." }
  ]
}

const Home = () => {
  const { user } = useAuth()

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-sand-100">Welcome, {user?.name}</h1>
      <p className="mt-1 text-nest-300">You are logged in as {user?.role.toLowerCase()}.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {user &&
          cards[user.role].map((c) => (
            <div key={c.title} className="rounded-2xl bg-white p-5 text-nest-900 shadow">
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p className="mt-1 text-sm text-nest-600">{c.text}</p>
              <span className="mt-3 inline-block rounded-full bg-sand-300 px-2.5 py-0.5 text-xs font-semibold text-nest-950">
                Coming soon
              </span>
            </div>
          ))}
      </div>

      {user?.role === "ADMIN" && (
        <Link to="/admin" className="mt-8 inline-block font-semibold text-sand-400 hover:underline">
          Go to the admin area →
        </Link>
      )}
    </AppLayout>
  )
}

export default Home