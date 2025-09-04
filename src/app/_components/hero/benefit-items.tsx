import { CheckCircle } from 'lucide-react'

type ItemsProps = {
  children: React.ReactNode
}
export function BenefitItems({ children }: ItemsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-2 text-center transition-all duration-300 hover:bg-slate-100 md:flex-row">
      <CheckCircle className="h-5 w-5 text-emerald-600" />
      <span className="font-semibold text-blue-900">{children}</span>
    </div>
  )
}
