import { Link } from "react-router-dom";

export function ServiceUnavailable() {
  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col gap-2 items-center justify-center">
      <h1 className="font-display text-6xl text-blue-500">503</h1>
      <span className="font-display text-xl text-blue-500">Service Unavailable</span>
      <p className="text-lg text-slate-900">This service is currently unavailable. Please check back later!</p>

      <Link to="/" className='inline-block mt-4 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 duration-300 text-slate-50 font-medium'>Go to home page</Link>
    </div>
  )
}
