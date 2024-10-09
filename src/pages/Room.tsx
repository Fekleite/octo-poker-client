import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Toast from '@radix-ui/react-toast'

import { socket } from '@/socket';
import { fibonacci } from "@/utils/sequences"
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { RoomToast } from '@/components/RoomToast';

interface VoteUserResponse {
  user: string;
  value: string | number;
}

export interface User {
  name: string;
  id: string;
  role: 'default' | 'admin'
}

interface RoomUsersResponse {
  name: string;
  code: string;
  users: User[]
}

interface SendVoteFormData {
  card: string;
}

interface VotesRoomFormData {
  votes: VoteUserResponse[];
}

export function Room() {
  const [votes, setVotes] = useState<VoteUserResponse[]>([])
  const [roomUsers, setRoomUsers] = useState<RoomUsersResponse | null>(null)
  const [canRevealCards, setCanRevealCards] = useState(false)
  const [openToast, setOpenToast] = useState(false);

  const { register, handleSubmit } = useForm<SendVoteFormData>()
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('vote-user', (response: VoteUserResponse) => {
      setVotes(prevState => [...prevState, response])
    })

    socket.on('room-users', (response: RoomUsersResponse) => {
      setRoomUsers(response);
    });

    socket.on('votes-room', (response: VotesRoomFormData) => {
      if (response.votes.length === 0) {
        setCanRevealCards(false);
        setVotes([])
      } else {
        setCanRevealCards(true)
      }
    });

    return () => {
      socket.off('vote-user');
      socket.off('room-users');
      socket.off('votes-room');
    };
  }, [])

  function handleSendVote(data: SendVoteFormData) {
    if (data.card && code) {
      const payload = { 
        room: {
          code,
        }, 
        value: data.card 
      }

      socket.emit('send-vote', payload)
    }
  }

  function handleRevealVote() {
    const payload = { 
      room: {
        code,
      }
    }

    socket.emit('reveal-votes', payload)
  }

  function handleStartNewRound() {
    const payload = { 
      room: {
        code,
      }
    }

    socket.emit('reset-votes', payload)
  }

  function handleCloseRoom() {
    setRoomUsers(null);
    setVotes([])

    socket.disconnect()

    navigate('/')
  }

  const isUserAdmin = true

  const roomUsersWithVote = useMemo(() => {
    return roomUsers?.users.map(user => {
      const userVote = votes.find(vote => vote.user === user.id)
  
      if (userVote) {
        return {
          ...user,
          hasVoted: true,
          vote: userVote.value
        }
      }
  
      return {
        ...user,
        hasVoted: false,
        vote: null
      }
    })
  }, [roomUsers, votes])

  return (
    <Toast.Provider duration={2000}>
      <div className="w-full">
        <Header onCloseRoom={handleCloseRoom} />

        <div className="w-full max-w-[640px] mx-auto my-10 space-y-4">
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
                      {user.name}
                    </span>
                  </li>
                )
              })}
            </ul>

            <span className="block text-center text-lg text-blue-300">Waiting for player votes...</span>
          </div>

          {isUserAdmin && (
            <div className="flex justify-center gap-2">
              <Button
                onClick={handleRevealVote}
                variant='secondary'
                type="button" 
              >
                Reveal cards
              </Button>
              <Button
                onClick={handleStartNewRound}
                type="button"
              >
                Start new round
              </Button>
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

      <RoomToast 
        open={openToast} 
        onOpenChange={setOpenToast}
        title='User just joined!'
        description='There is a new user in this room.'
      />        
    </Toast.Provider>
  )
}