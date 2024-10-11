import { Link } from 'react-router-dom'

import octopus from '@/assets/octopus.png'

export function Home() {
  return (
    <div className="w-full h-screen bg-blue-500 flex justify-center items-center">
      <div className='flex items-center gap-8'>
        <img src={octopus} alt="Octopus" className='animate-fade-in'/>

        <div>
          <h1 className="font-display text-6xl text-slate-50">OctoPoker</h1>
          <p className='text-slate-50 mt-2'>Collaborate with your team, plan what to do.</p>

          <div className='flex items-center gap-2 mt-4'>
            <Link
              to="/room/create"
              className='inline-block px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 duration-300 text-slate-50 font-medium'
            >
              Start a new room
            </Link>
            <Link
              to="/room/join"
              className='px-4 py-2 text-slate-50 font-medium'
            >
              Join in a room
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
