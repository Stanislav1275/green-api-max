import { useFormState } from 'react-hook-form'

import { useCanSubmit } from '@/shared/lib/form'

import { Button, type ButtonProps } from '../button'
import { Spinner } from '../spinner'

type FormSubmitProps = Omit<ButtonProps, 'type'> & {
  requireValid?: boolean
  requireFilled?: boolean
}

export const FormSubmit = ({
  requireValid,
  requireFilled,
  disabled,
  children,
  ...props
}: FormSubmitProps) => {
  const canSubmit = useCanSubmit({ requireValid, requireFilled })
  const { isSubmitting } = useFormState()

  return (
    <Button type="submit" disabled={disabled ?? !canSubmit} {...props}>
      {isSubmitting ? <Spinner /> : null}
      {children}
    </Button>
  )
}
