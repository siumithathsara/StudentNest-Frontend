import { useEffect } from "react"
import Router from "./router"
import { restoreSession } from "./store/authSlice"
import { useAppDispatch } from "./store/hooks"

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  return <Router />
}

export default App