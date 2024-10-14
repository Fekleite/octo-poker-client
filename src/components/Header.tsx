import octopus from '@/assets/octopus.png'

import { Button } from './Button'

import { IUser } from '@/@types/eventResponse'

interface HeaderProps {
  onCloseRoom: () => void,
  currentUser: IUser | undefined
}

export function Header({ onCloseRoom, currentUser }: HeaderProps) {
  const isUserAdmin = currentUser?.role === 'admin'

  return (
    <header className="w-full flex justify-between items-center py-4 px-8 border-b border-slate-100">
      <div className="flex gap-6 items-center">
        <img src={octopus} alt="Octopus" className="w-12 h-12" />

        <div>
          <h2 className="text-xl font-display text-blue-500">Room name</h2>
          <span className="text-xs font-medium text-slate-500">created by octo</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 bg-slate-100 rounded-full" />
          <span className="text-sm font-medium text-slate-800">{currentUser?.name}</span>
        </div>

        {isUserAdmin && (
          <div className="space-x-2">
            <Button
              variant='secondary'
              type="button"
            >
              Invite players
            </Button>
            <Button
              onClick={onCloseRoom}
              variant='danger'
              type="button"
            >
              Close room
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
