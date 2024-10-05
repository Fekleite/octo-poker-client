import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/Home";
import { CreateRoom } from "./pages/CreateRoom";
import { JoinRoom } from "./pages/JoinRoom";
import { Room } from "./pages/Room";

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
    path: '/room/join',
    element: <JoinRoom />
  },
  {
    path: '/room/join/:code',
    element: <Room />
  }
])