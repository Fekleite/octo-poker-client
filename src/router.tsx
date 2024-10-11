import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/app/home";
import { CreateRoom } from "./pages/app/create-room";
import { JoinRoom } from "./pages/app/join-room";
import { Room } from "./pages/app/room";
import { ServiceUnavailable } from "./pages/error/service-unavailable";
import { NotFound } from "./pages/error/not-found";

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
  },
  {
    path: '/service-unavailable',
    element: <ServiceUnavailable />
  },
  {
    path: '/not-found',
    element: <NotFound />
  }
])
