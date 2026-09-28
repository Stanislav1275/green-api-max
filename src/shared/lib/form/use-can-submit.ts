import { useFormState } from 'react-hook-form'

type CanSubmitOptions = {
  /** also wait until the form passes validation */
  requireValid?: boolean
}

/** Whether the surrounding `<Form>` may be submitted right now. */
export const useCanSubmit = ({ requireValid = false }: CanSubmitOptions = {}) => {
  const { isSubmitting, isValid } = useFormState()
  return !isSubmitting && (!requireValid || isValid)
}
