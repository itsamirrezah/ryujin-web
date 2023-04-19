import { RouterProvider } from "@tanstack/router"
import { router } from "./lib/router"

function App() {
  return <RouterProvider router={router}/>
}

export default App
