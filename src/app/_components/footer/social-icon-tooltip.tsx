import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type SocialIconTooltipProps = {
  children: React.ReactNode
  link: string
  label: string
}

export function SocialIconTooltip({ children, link, label }: SocialIconTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="hover:-translate-y-1 text-center transition-all duration-300 hover:shadow-2xl">
          <Button size="icon" variant="default">
            <Link href={link} target="_blank">
              {children}
            </Link>
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent className="border border-white/50">{label}</TooltipContent>
    </Tooltip>
  )
}
