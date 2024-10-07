import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'link'
}

export function Button({ children, variant = "primary", ...rest }: ButtonProps) {
  const variantClasses = {
    primary: "bg-pink-500 hover:bg-pink-600 text-slate-50",
    secondary: "bg-blue-500 hover:bg-blue-600 text-slate-50",
    danger: "bg-red-500 hover:bg-red-600 text-slate-50",
    link: "text-slate-50"
  }

  return (
    <button {...rest} className={`px-4 py-2 rounded-md duration-300 font-medium ${variantClasses[variant]}`}>
      {children}
    </button>
  )
}