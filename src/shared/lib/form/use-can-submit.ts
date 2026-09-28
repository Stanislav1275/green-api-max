import { useFormState, useWatch } from 'react-hook-form'

type CanSubmitOptions = {
  /** also wait until the form passes validation */
  requireValid?: boolean
  /** keep disabled while any field is empty (web.max.ru style); errors still show on submit */
  requireFilled?: boolean
}

const isFilled = (value: unknown) => typeof value !== 'string' || value.trim() !== ''

/** Whether the surrounding `<Form>` may be submitted right now. */
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
