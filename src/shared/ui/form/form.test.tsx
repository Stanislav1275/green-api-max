import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as z from 'zod'

import { useZodForm } from '@/shared/lib/form'

import { Form, FormField, FormSubmit } from '.'

const schema = z.object({
  nickname: z.string().min(2, 'Минимум 2 символа'),
})

const Nickname = ({ onSubmit }: { onSubmit: (values: z.output<typeof schema>) => unknown }) => {
  const form = useZodForm(schema)
  return (
    <Form form={form} onSubmit={onSubmit} resetOnSubmit>
      <FormField name="nickname" label="Ник" />
      <FormSubmit>Сохранить</FormSubmit>
    </Form>
  )
}

describe('Form + FormField', () => {
  it('keeps a field without a default controlled and marks it invalid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Nickname onSubmit={onSubmit} />)

    expect(screen.getByLabelText('Ник')).toHaveValue('')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(await screen.findByLabelText('Ник')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits parsed values and resets the form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Nickname onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Ник'), 'max')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(onSubmit).toHaveBeenCalledWith({ nickname: 'max' })
    expect(screen.getByLabelText('Ник')).toHaveValue('')
  })
})
