import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col gap-2 items-center justify-center">
      <h1 className="font-display text-6xl text-blue-500">404</h1>
      <span className="font-display text-xl text-blue-500">Room Not Found</span>
      <p className="text-lg text-slate-900">This room does not exist, create a new room or join an existing room!</p>

      <div className="flex gap-4 mt-4">
        <Link to="/room/create" className='inline-block px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 duration-300 text-slate-50 font-medium'>Create a new room</Link>
        <Link to="/room/join" className='inline-block px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 duration-300 text-slate-50 font-medium'>Join in a room</Link>
      </div>
    </div>
  )
}
