import { nanoid } from 'nanoid';
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { useSocket } from '@/hooks/useSocket';

import { Button } from '@/components/Button';

interface CreateRoomData {
  name: string;
  room: string;
}

export function CreateRoom() {
  const { socket } = useSocket()

  const { register, handleSubmit } = useForm<CreateRoomData>()

  const navigate = useNavigate()

  function handleCreateRoom(data: CreateRoomData) {
    const code = nanoid()

    const payload = {
      room: {
        name: data.room,
        code,
      },
      user: {
        name: data.name
      }
    }

    socket.emit("on-create-room", payload);

    navigate(`/room/${code}`)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleCreateRoom)}
        className='my-6 w-full max-w-60 flex flex-col gap-2'
      >
        <input
          {...register('name')}
          className='w-full h-10 bg-slate-100 px-4 py-2 rounded-md focus:ring-2 ring-blue-500 outline-none'
          type="text"
          placeholder='Type your name'
        />
        <input
          {...register('room')}
          className='w-full h-10 bg-slate-100 px-4 py-2 rounded-md focus:ring-2 ring-blue-500 outline-none'
          type="text"
          placeholder='Type the room name'
        />

        <Button type="submit" >Create room</Button>
      </form>

      <Link
        to="/room/join"
        className='text-sm font-medium text-blue-500 hover:underline decoration-blue-500'
      >
        I already have a code
      </Link>
   </>
  )
}
