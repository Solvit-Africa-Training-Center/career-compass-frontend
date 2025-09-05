import { BrowserRouter } from "react-router-dom"
import AppRoute from "./routes/AppRoute"
import { AuthProvider } from "./context/AuthContext"

function App() {

  return (
    <>
      {/* <Register /> */}
      {/* <Login /> */}
      <BrowserRouter>
            <AuthProvider>
              <AppRoute />
            </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
