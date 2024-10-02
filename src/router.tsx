import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/auth',
    element: <div>Auth</div>
  },
  {
    path: '/room/:code',
    element: <div>Room</div>
  }
])