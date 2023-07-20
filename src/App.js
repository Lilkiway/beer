import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { BeerList } from "./views/BeerList";
import { OneBeer } from "./views/OneBeer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BeerList />
  },
  {
    path: '/beer/:id',
    element: <OneBeer />,
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App;
