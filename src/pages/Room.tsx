import octopus from '@/assets/octopus.png'
import { socket } from '@/socket';
import { fibonacci } from "@/utils/sequences"
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

interface Vote {
  user: string;
  vote: string;
}

interface RoomUser {
  id: string;
  username: string;
}

interface FormData {
  card: string;
}

export function Room() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [canRevealCards, setCanRevealCards] = useState(false)

  const { register, handleSubmit, resetField } = useForm<FormData>()
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('message', (data: Vote) => {
      setVotes(prevState => [...prevState, data])
    })

    socket.on('room-users', (usersInRoom: RoomUser[]) => {
      setRoomUsers(usersInRoom);
    });

    return () => {
      socket.off('message');
      socket.off('room-users');
    };
  }, [])

  function handleSendVote(data: FormData) {
    if (data.card && code) {
      const payload = { roomCode: code, vote: data.card }
      socket.emit('send-vote', payload)
    }
  }

  function handleRevealVote() {
    setCanRevealCards(true);
  }

  function handleStartNewRound() {
    setCanRevealCards(false);
    resetField('card')
    setVotes([])
  }

  function handleCloseRoom() {
    setRoomUsers([]);
    setVotes([])

    socket.disconnect()

    navigate('/')
  }

  const isUserAdmin = true

  const roomUsersWithVote = useMemo(() => {
    return roomUsers.map(roomUser => {
      const userVote = votes.find(vote => vote.user === roomUser.id)
  
      if (userVote) {
        return {
          ...roomUser,
          hasVoted: true,
          vote: userVote.vote
        }
      }
  
      return {
        ...roomUser,
        hasVoted: false,
        vote: null
      }
    })
  }, [roomUsers, votes])

  return (
    <div className="w-full h-screen overflow-hidden">
      <header className="w-full flex justify-between items-center py-4 px-8 border-b border-slate-100">
        <div className="flex gap-6 items-center">
          <img src={octopus} alt="Octopus" className="w-12 h-12" />

          <div>
            <h2 className="text-xl font-display text-blue-500">Room name</h2>
            <span className="text-xs font-medium text-slate-500">created by user</span>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 bg-slate-100 rounded-full" />
            <span className="text-sm font-medium text-slate-800">Username</span>
          </div>

         {isUserAdmin && (
            <div className="space-x-2">
              <button 
                type="button" 
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 duration-300 text-slate-50 font-medium"
              >
                Invite players
              </button>
              <button
                onClick={handleCloseRoom}
                type="button" 
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 duration-300 text-slate-50 font-medium"
              >
                Close room
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="w-full max-w-[640px] mx-auto my-10 h-full max-h-[480px] space-y-4">
        <div className="p-4 rounded-md bg-slate-100">
          <ul className="grid grid-cols-5 gap-4 mb-5">
            {roomUsersWithVote?.map(user => {
              return (
                <li className="space-y-2" key={user.id}>
                  <div className={`w-12 h-16 rounded-md flex items-center justify-center ${user.hasVoted ? 'bg-pink-500' : 'bg-blue-500'}`}>
                    {canRevealCards &&  user.hasVoted && (
                      <span className='font-display text-slate-50 text-xl'>{user.vote}</span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-600">
                    {user.username}
                  </span>
                </li>
              )
            })}
          </ul>

          <span className="block text-center text-lg text-blue-300">Waiting for player votes...</span>
        </div>

        {isUserAdmin && (
          <div className="flex justify-center gap-2">
            <button
              onClick={handleRevealVote}
              type="button" 
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 duration-300 text-slate-50 font-medium"
            >
              Reveal cards
            </button>
            <button
              onClick={handleStartNewRound}
              type="button" 
              className="px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 duration-300 text-slate-50 font-medium"
            >
              Start new round
            </button>
          </div>
        )}
      </div>

      <div className="w-full">
        <form 
          onSubmit={handleSubmit(handleSendVote)}
          className="flex flex-col items-center justify-end"
        >
          <div className="flex gap-4 justify-center">
            {fibonacci.map(value => (
              <div key={value}>
                <input 
                  {...register('card')}
                  className="appearance-none peer" 
                  type="radio" name="card" 
                  id={`card-${value}`}
                  value={value}
                />
                <label className="w-32 h-40 border-2 border-blue-500 rounded-md flex items-center justify-center font-display text-4xl text-blue-500 cursor-pointer hover:bg-blue-50 transition duration-300 peer-checked:bg-blue-500 peer-checked:text-slate-50" htmlFor={`card-${value}`}>{value}</label>
              </div>
            ))}
          </div>

          <button type="submit" className="w-24 h-24 translate-y-4 rounded-full border-pink-500 bg-pink-500 hover:bg-pink-600 duration-300 text-slate-50 text-lg font-bold">Play</button>
        </form>
      </div>
    </div>
  )
}