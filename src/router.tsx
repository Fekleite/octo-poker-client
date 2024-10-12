import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/app/home";
import { CreateRoom } from "./pages/app/create-room";
import { JoinRoom } from "./pages/app/join-room";
import { Room } from "./pages/app/room";

import { ServiceUnavailable } from "./pages/error/service-unavailable";
import { NotFound } from "./pages/error/not-found";

import { AuthLayout } from "./pages/layouts/auth";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/room',
    element: <AuthLayout />,
    children: [
      {
        path: 'create',
        element: <CreateRoom />
      },
      {
        path: 'join',
        element: <JoinRoom />
      },
    ]
  },
  {
    path: '/room/:code',
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
