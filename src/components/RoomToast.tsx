import * as Toast from '@radix-ui/react-toast'

interface RoomToastProps extends Toast.ToastProps {
  title: string
  description: string
}

export function RoomToast({ open, onOpenChange, title, description }: RoomToastProps) {
  return (
    <>
      <Toast.Root 
        open={open} 
        onOpenChange={onOpenChange}
        className='bg-green-100 border border-green-200 rounded-md p-4 '
      >
        <Toast.Title className='font-bold text-green-500'>
          {title}
        </Toast.Title>

        <Toast.Description className='font-medium text-sm text-green-500'>
          {description}
        </Toast.Description>
      </Toast.Root>

      <Toast.Viewport className='fixed bottom-0 right-0 w-80 z-50 p-4' />
    </>
  )
}