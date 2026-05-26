import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        brandBlue:
          'border-transparent bg-brand-blue/15 text-brand-blue hover:bg-brand-blue/25',
        brandGreen:
          'border-transparent bg-brand-green/20 text-brand-gray hover:bg-brand-green/30',
        brandGold:
          'border-transparent bg-brand-gold/30 text-brand-gold-dark hover:bg-brand-gold/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeProps = React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
export type { BadgeProps }
