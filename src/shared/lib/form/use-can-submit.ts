import { useFormState, useWatch } from 'react-hook-form'

type CanSubmitOptions = {
  requireValid?: boolean
  requireFilled?: boolean
}

const isFilled = (value: unknown) => typeof value !== 'string' || value.trim() !== ''

export const useCanSubmit = ({
  requireValid = false,
  requireFilled = false,
}: CanSubmitOptions = {}) => {
  const { isSubmitting, isValid } = useFormState()
  const values = useWatch() as Record<string, unknown>
  return (
    !isSubmitting &&
    (!requireValid || isValid) &&
    (!requireFilled || Object.values(values).every(isFilled))
  )
}
