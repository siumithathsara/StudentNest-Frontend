import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [status, setStatus] = useState("checking...")

  useEffect(() => {
   
    const base = import.meta.env.VITE_API_URL.replace("/api/v1", "")
    axios
      .get(`${base}/health`)
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus("backend is not reachable"))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-teal-700"> StudentNest</h1>
        <p className="mt-2 text-slate-600">Backend status: {status}</p>
      </div>
    </div>
  )
}

export default App