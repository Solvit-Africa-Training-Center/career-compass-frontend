import { BrowserRouter } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AppRoute from "./routes/AppRoute"

function App() {

  return (
    <>
      {/* <Register /> */}
      {/* <Login /> */}
      <BrowserRouter>
            <AppRoute />
      </BrowserRouter>
    </>
  )
}

export default App
