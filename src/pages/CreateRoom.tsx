import octopus from '@/assets/octopus.png'
import { Link } from 'react-router-dom'

export function CreateRoom() {
  return (
    <div className='w-full h-screen overflow-hidden flex'>
      <div className='w-3/5 h-full bg-blue-500 flex items-center justify-center'>
        <div className='w-[480px] h-3/4 border-2 border-slate-50 rounded-md flex items-center justify-center relative bg-slate-50 bg-opacity-20'>
          <span className='font-display text-6xl text-slate-50 absolute top-5 left-5'>01</span>
          <span className='font-display text-6xl text-slate-50 absolute bottom-5 right-5 rotate-180'>01</span>

          <img src={octopus} alt="Octopus" className='w-40 h-40'/>
        </div>
      </div>

      <div className='h-full flex-1 flex flex-col items-center justify-center animate-fade-in-up'>
       <h1 className="font-display text-6xl text-blue-500">OctoPoker</h1>

        <form className='my-6 w-full max-w-60 flex flex-col gap-2'>
          <input className='w-full h-10 bg-slate-100 px-4 py-2 rounded-md focus:ring-2 ring-blue-500 outline-none' type="text" placeholder='Type your name' />
          <input className='w-full h-10 bg-slate-100 px-4 py-2 rounded-md focus:ring-2 ring-blue-500 outline-none' type="text" placeholder='Type the room name' />

          <button type="submit" className='px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 duration-300 text-slate-50 font-medium'>Create room</button>
        </form>

        <Link to="/room/join" className='text-sm font-medium text-blue-500 hover:underline decoration-blue-500'>I already have a code</Link>
      </div>
    </div>
  )
}