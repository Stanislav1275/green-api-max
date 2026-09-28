import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed disabled:bg-primary-disabled disabled:text-disabled-foreground data-disabled:bg-primary-disabled data-disabled:text-disabled-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-pressed disabled:text-disabled-foreground',
        ghost: 'text-foreground hover:bg-muted active:bg-hover disabled:opacity-50',
        outline: 'border border-border hover:bg-muted active:bg-hover disabled:opacity-50',
        link: 'text-link hover:text-link-hover disabled:opacity-50',
        destructive:
          'bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-sm',
        default: 'h-10 rounded-lg px-4 text-[15px]',
        lg: 'h-14 rounded-xl px-6 text-base',
        icon: 'size-10 rounded-full',
        inline: 'h-auto p-0 text-[15px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
