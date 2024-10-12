import octopus from '@/assets/octopus.png'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className='w-full h-screen overflow-hidden flex'>
      <div className='w-3/5 h-full bg-blue-500 flex items-center justify-center'>
        <div className='w-[480px] h-3/4 border-2 border-slate-50 rounded-md flex items-center justify-center relative bg-slate-50 bg-opacity-20'>
          <span className='font-display text-6xl text-slate-50 absolute top-5 left-5'>01</span>
          <span className='font-display text-6xl text-slate-50 absolute bottom-5 right-5 rotate-180'>01</span>

          <img src={octopus} alt="Octopus" className='w-40 h-40'/>
        </div>
      </div>

      <div className='h-full flex-1 flex flex-col items-center justify-center'>
        <h1 className="font-display text-6xl text-blue-500">OctoPoker</h1>

        <Outlet />
      </div>
    </div>
  )
}
