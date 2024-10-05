import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/Home";
import { CreateRoom } from "./pages/CreateRoom";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/room/create',
    element: <CreateRoom />
  },
  {
    path: '/room/:code',
    element: <div>Room</div>
  }
])