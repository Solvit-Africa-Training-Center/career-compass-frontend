import AppRoute from "./routes/AppRoute"
import { Toaster } from "sonner"

function App() {

  return (
    <>
      <AppRoute />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
