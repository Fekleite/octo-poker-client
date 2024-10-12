import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

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

    navigate(`/room/${data.code}`)
  }

  return (
    <>
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
    </>
  )
}
