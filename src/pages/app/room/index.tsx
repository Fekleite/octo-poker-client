import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { IRoom, IUser, IVote } from '@/@types/eventResponse';
import { useSocket } from '@/hooks/useSocket';

import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Deck } from '@/components/Deck';

export function Room() {
  const [votes, setVotes] = useState<IVote[]>([])
  const [room, setRoom] = useState<IRoom | null>(null)
  const [canShowCards, setCanShowCards] = useState(false)

  const { socket } = useSocket()
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('on-room-was-create', (response: { room: IRoom }) => {
      setRoom(response.room)
    })

    socket.on('on-user-joined-room', (response: { room: IRoom, user: IUser }) => {
      setRoom(response.room)
      toast.info(`${response.user.name} joined!`)
    })

    socket.on('on-user-left-room', (response: { room: IRoom, user: IUser }) => {
      setRoom(response.room)
      toast.info(`${response.user.name} left!`)
    })

    socket.on('on-room-was-close', () => {
      setRoom(null)
      navigate("/")
    })

    socket.on('on-vote-was-send', () => {
      toast.success("A player already vote!")
    })

    socket.on('on-vote-was-remove', () => {
      toast.warning("A player remove his vote!")
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
  }, [navigate, socket])

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
        {code && <Deck code={code} />}
      </div>
    </div>
  )
}
