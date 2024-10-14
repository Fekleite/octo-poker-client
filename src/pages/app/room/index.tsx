import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { IRoom, IUser, IVote } from '@/@types/eventResponse';
import { useSocket } from '@/hooks/useSocket';

import { Header } from '@/components/Header';
import { Deck } from '@/components/Deck';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface VotesByUser {
  user: IUser;
  value: string | number
}

export function Room() {
  const [votes, setVotes] = useState<IVote[]>([])
  const [room, setRoom] = useState<IRoom | null>(null)
  const [canShowCards, setCanShowCards] = useState(false)

  const { socket } = useSocket()
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('created', (response: { room: IRoom }) => {
      setRoom(response.room)
    })

    socket.on('joined', (response: { room: IRoom, user: IUser }) => {
      setRoom(response.room)
      toast.success(`${response.user.name} joined!`)
    })

    socket.on('left', (response: { room: IRoom, user: IUser }) => {
      setRoom(response.room)
      toast.error(`${response.user.name} left!`)
    })

    socket.on('closed', () => {
      setRoom(null)
      navigate("/")
    })

    socket.on('vote-sent', (response: { user: string, value: string }) => {
      setVotes(prevState => [...prevState, { user: response.user, value: response.value, }])
    })

    socket.on('vote-removed', (response: { user: string }) => {
      setVotes(prevState => {
        return prevState.filter(vote => vote.user !== response.user)
      })
    })

    socket.on('revealed-votes', () => {
      setCanShowCards(true)
    })

    socket.on('reset-votes', () => {
      setVotes([])
      setCanShowCards(false)
    })

    return () => {
      socket.off('created');
      socket.off('joined');
      socket.off('left');
      socket.off('close');
      socket.off('vote-sent');
      socket.off('vote-removed');
      socket.off('revealed-votes');
      socket.off('reset-votes');
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
  }

  const currentUser = room?.users.find(user => user.id === socket.id)
  const isUserAdmin = currentUser?.role === 'admin'

  const votesByUser = useMemo(() => {
    if (!room) {
      return []
    }

    return votes.reduce((result, vote) => {
      const userWhoVoted = room.users.find((user) => user.id === vote.user)

      if (userWhoVoted) {
        result.push({
          user: userWhoVoted,
          value: vote.value
        })
      }

      return result;
    }, [] as VotesByUser[])
  }, [room, votes])

  return (
    <div className="w-full">
      <Header
        onCloseRoom={handleCloseRoom}
        currentUser={currentUser}
      />

      <div className="w-full max-w-[880px] mx-auto my-10 flex justify-between gap-8">
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium text-blue-500'>Active users:</h3>

            <ul className='mt-2 space-y-1'>
              {room?.users.map(user => (
                <li className='flex gap-2 items-center'>
                  <span className='font-medium text-sm text-slate-700'>{user.name}</span>
                  {user.role === 'admin' && (
                    <div className='text-xs py-[2px] px-1 rounded-md bg-blue-100 border border-blue-200 text-blue-500'>{user.role}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {isUserAdmin && (
            <div className="p-2 bg-slate-200 rounded-md flex flex-col gap-2 mt-2">
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

        <div className="flex-1 flex items-center justify-center p-4 rounded-md border-2 border-slate-300">
          {votes.length > 0 ? (
            <div className="grid grid-cols-6 gap-4">
              {votesByUser?.map((vote) => {
                return (
                  <Card
                    key={vote.user.id}
                    user={vote.user.name}
                    vote={vote.value}
                    canShowCardValue={canShowCards}
                  />
                )
              })}
            </div>
          ) : (
            <span className="block text-center text-lg text-blue-300">Waiting for votes...</span>
          )}
        </div>
      </div>

      <div className="w-full">
        {code && <Deck code={code} />}
      </div>
    </div>
  )
}
