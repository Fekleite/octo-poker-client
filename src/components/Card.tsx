import { CheckCircle } from "@phosphor-icons/react"

interface CardProps {
  user: string
  vote: string | number
  canShowCardValue: boolean
}

export function Card({ vote, canShowCardValue }: CardProps) {
  const variant = canShowCardValue ? 'front' : 'back'

  const variantClasses = {
    front: "border-blue-500 bg-blue-500",
    back: "border-pink-500 bg-pink-200",
  }

  return (
    <div className={`w-16 h-20 flex items-center justify-center border-2 rounded-md ${variantClasses[variant]}`}>
      {canShowCardValue ? (
        <span className="font-display text-slate-50 text-xl">{vote}</span>
      ) : (
        <CheckCircle size={32} weight="fill" color="#ec4899" />
      )}
    </div>
  )
}
