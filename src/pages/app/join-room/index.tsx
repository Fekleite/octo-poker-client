import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import octopus from '@/assets/octopus.png'

import { useSocket } from '@/hooks/useSocket';

import { Button } from '@/components/Button';

interface JoinFormData {
  name: string;
  code: string;
}

export function JoinRoom() {
  const { socket } = useSocket()

  const { register, handleSubmit } = useForm<JoinFormData>()

  const navigate = useNavigate()

  function handleJoinInRoom(data: JoinFormData) {
    const payload = {
      room: {
        code: data.code,
      },
      user: {
        name: data.name,
      }
    }

    socket.emit("on-join-room", payload);

    navigate(`/room/join/${data.code}`)
  }

  return (
    <div className='w-full h-screen overflow-hidden flex'>
      <div className='w-3/5 h-full bg-blue-500 flex items-center justify-center'>
        <div className='w-[480px] h-3/4 border-2 border-slate-50 rounded-md flex items-center justify-center relative bg-slate-50 bg-opacity-20'>
          <span className='font-display text-6xl text-slate-50 absolute top-5 left-5'>02</span>
          <span className='font-display text-6xl text-slate-50 absolute bottom-5 right-5 rotate-180'>02</span>

          <img src={octopus} alt="Octopus" className='w-40 h-40'/>
        </div>
      </div>

      <div className='h-full flex-1 flex flex-col items-center justify-center'>
      <h1 className="font-display text-6xl text-blue-500">OctoPoker</h1>

        <form
          onSubmit={handleSubmit(handleJoinInRoom)}
          className='my-6 w-full max-w-60 flex flex-col gap-2'
        >
          <input
            {...register('name')}
            className='w-full h-10 bg-slate-100 px-4 py-2 rounded-md focus:ring-2 ring-blue-500 outline-none'
            type="text"
            placeholder='Type your name'
          />
          <input
            {...register('code')}
            className='w-full h-10 bg-slate-100 px-4 py-2 rounded-md focus:ring-2 ring-blue-500 outline-none'
            type="text"
            placeholder='Type room code'
          />

          <Button type="submit">Join this room</Button>
        </form>

        <Link
          to="/room/create"
          className='text-sm font-medium text-blue-500 hover:underline decoration-blue-500'
        >
          I want to create a new room
        </Link>
      </div>
    </div>
  )
}
