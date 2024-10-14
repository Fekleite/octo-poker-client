import { useForm } from "react-hook-form";

import { Button } from "./Button";

import { fibonacci } from "@/utils/sequences"
import { useSocket } from "@/hooks/useSocket";

interface SendVoteFormData {
  card: string | number
}

interface DeckProps {
  code: string
}

export function Deck({ code }: DeckProps) {
  const { register, handleSubmit, resetField } = useForm<SendVoteFormData>()

  const { socket } = useSocket()

  function handleSendVote(data: SendVoteFormData) {
    if (data.card) {
      const payload = {
        room: {
          code,
        },
        value: data.card
      }

      socket.emit('on-send-vote', payload)
    }
  }

  function handleRemoveVote() {
    const payload = {
      room: {
        code,
      },
    }

    socket.emit('on-remove-vote', payload)

    resetField('card')
  }

  return (
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
            <label
              className="w-32 h-40 border-2 border-blue-500 rounded-md flex items-center justify-center font-display text-4xl text-blue-500 cursor-pointer hover:bg-blue-50 hover:-translate-y-2 transition duration-300 peer-checked:bg-blue-500 peer-checked:text-slate-50 peer-checked:-translate-y-2"
              htmlFor={`card-${value}`}
            >
              {value}
            </label>
          </div>
        ))}
      </div>

      <div className='w-full flex justify-center gap-4 mt-8 p-4 bg-slate-100 '>
        <Button type="submit" variant='secondary'>Send vote</Button>
        <Button type="button" onClick={handleRemoveVote} variant='danger'>Reset vote</Button>
      </div>
    </form>
  )
}
