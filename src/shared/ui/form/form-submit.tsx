import { useFormState } from 'react-hook-form'

import { useCanSubmit } from '@/shared/lib/form'

import { Button, type ButtonProps } from '../button'
import { Spinner } from '../spinner'

type FormSubmitProps = Omit<ButtonProps, 'type'> & {
  /** keep disabled until the form passes validation */
  requireValid?: boolean
}

/** Submit button of the surrounding `<Form>`: disabled while submitting, spinner for async submits. */
export const FormSubmit = ({ requireValid, disabled, children, ...props }: FormSubmitProps) => {
  const canSubmit = useCanSubmit({ requireValid })
  const { isSubmitting } = useFormState()

  return (
    <Button type="submit" disabled={disabled ?? !canSubmit} {...props}>
      {isSubmitting ? <Spinner /> : null}
      {children}
    </Button>
  )
}
