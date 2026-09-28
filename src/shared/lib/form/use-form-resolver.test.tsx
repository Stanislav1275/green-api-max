import { render, renderHook, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'

import { ResponseError } from '@/shared/api/gen/.kubb/client'
import { ToastProvider } from '@/shared/ui/toast'

import { useFormResolver } from '.'

const responseError = (status: number, data: unknown) =>
  new ResponseError({
    data,
    status,
    statusText: '',
    request: new Request('https://api.test'),
    response: new Response(),
  })

type Values = { text: string; phone: string }

const setup = (fieldMap?: Record<string, 'text' | 'phone'>) => {
  render(<ToastProvider>{null}</ToastProvider>)
  const { result } = renderHook(() => {
    const form = useForm<Values>({ defaultValues: { text: '', phone: '' } })
    return { form, ...useFormResolver(form, { fieldMap }) }
  })
  return result
}

describe('useFormResolver', () => {
  it('puts server field errors into the form and shows no toast', async () => {
    const result = setup({ message: 'text' })

    await result.current.resolveError(
      responseError(400, {
        errors: [
          { field: 'message', message: 'Слишком длинно' },
          { field: 'phone', message: 'Неверный номер' },
        ],
      }),
    )

    expect(result.current.form.getFieldState('text').error?.message).toBe('Слишком длинно')
    expect(result.current.form.getFieldState('phone').error?.message).toBe('Неверный номер')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('toasts field errors that have no matching form field', async () => {
    const result = setup()

    await result.current.resolveError(
      responseError(400, {
        message: 'Проверьте запрос',
        errors: { phone: 'Неверный номер', unknown: 'x' },
      }),
    )

    expect(result.current.form.getFieldState('phone').error?.message).toBe('Неверный номер')
    expect(await screen.findByRole('alert')).toHaveTextContent('Проверьте запрос')
  })

  it('toasts non-validation errors', async () => {
    const result = setup()

    const appError = await result.current.resolveError(responseError(401, null))

    expect(appError.kind).toBe('http')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Неверный idInstance или apiTokenInstance',
    )
  })
})
