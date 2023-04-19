import { RouterProvider } from "@tanstack/router"
import Layout from "./components/layout/layout"
import { router } from "./lib/router"

function App() {
    return (
            <Layout>
                <RouterProvider router={router}/>
            </Layout>
   )
}

export default App
