import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Toast from '@radix-ui/react-toast'

import { socket } from '@/socket';
import { fibonacci } from "@/utils/sequences"
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { RoomToast } from '@/components/RoomToast';
import { IRoom, IUser, IVote } from '@/@types/eventResponse';

interface SendVoteFormData {
  card: string | number
}

export function Room() {
  const [votes, setVotes] = useState<IVote[]>([])
  const [room, setRoom] = useState<IRoom | null>(null)

  const [canShowCards, setCanShowCards] = useState(false)
  
  const [isToastOpen, setIsToastOpen] = useState(false)
  const [toastInfo, setToastInfo] = useState({
    title: '',
    description: ''
  });

  const { register, handleSubmit } = useForm<SendVoteFormData>()
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('on-room-was-create', (response: { room: IRoom }) => {
      setRoom(response.room)
    })

    socket.on('on-user-joined-room', (response: { room: IRoom, user: IUser }) => {
      setRoom(response.room)
      setIsToastOpen(true)
      setToastInfo({
        title: `${response.user.name} joined!`,
        description: "There is a new user in the room."
      })
    })

    socket.on('on-user-left-room', (response: { room: IRoom, user: IUser }) => {
      setRoom(response.room)
      setIsToastOpen(true)
      setToastInfo({
        title: `${response.user.name} left!`,
        description: "An user just left the room."
      })
    })

    socket.on('on-room-was-close', () => {
      setRoom(null)
      navigate("/")
    })

    socket.on('on-vote-was-send', () => {
      setIsToastOpen(true)
      setToastInfo({
        title: "Someone already vote!",
        description: "There is a new vote for this round."
      })
    })

    socket.on('on-votes-were-reveal', (response: { votes: IVote[] }) => {
      setVotes(response.votes);
      setCanShowCards(true)
    })

    socket.on('on-votes-were-reset', (response: { votes: [] }) => {
      setVotes(response.votes)
      setCanShowCards(false)
    })

    return () => {
      socket.off('on-room-was-create');
      socket.off('on-user-joined-room');
      socket.off('on-user-left-room');
      socket.off('on-room-was-close');
      socket.off('on-vote-was-send');
      socket.off('on-votes-were-reveal');
      socket.off('on-votes-were-reset');
    };
  }, [navigate])

  function handleSendVote(data: SendVoteFormData) {
    if (data.card && code) {
      const payload = { 
        room: {
          code,
        },
        value: data.card 
      }

      socket.emit('on-send-vote', payload)
    }
  }

  function handleRevealVote() {
    const payload = { 
      room: {
        code,
      }
    }

    socket.emit('on-reveal-votes', payload)
  }

  function handleStartNewRound() {
    const payload = { 
      room: {
        code,
      }
    }

    socket.emit('on-reset-votes', payload)
  }

  function handleCloseRoom() {
    const payload = { 
      room: {
        code,
      },
      user: {
        id: socket.id
      }
    }

    socket.emit('close-room', payload)
    navigate('/')
  }

  const isUserAdmin = true

  const roomUsersWithVote = useMemo(() => {
    return room?.users.map(user => {
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
  }, [room, votes])

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
                      {canShowCards &&  user.hasVoted && (
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
        open={isToastOpen} 
        onOpenChange={setIsToastOpen}
        title={toastInfo.title}
        description={toastInfo.description}
      />        
    </Toast.Provider>
  )
}