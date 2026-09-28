import { render, screen } from '@testing-library/react'

import { Alert } from './alert'
import { Avatar } from './avatar'
import { Button, buttonVariants } from './button'
import { Card } from './card'
import { Field } from './field'
import { Input } from './input'
import { toast, ToastProvider } from './toast'

describe('ui-kit', () => {
  it('Button merges variant classes with custom ones', () => {
    render(
      <Button variant="destructive" size="sm" className="w-full">
        Удалить
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Удалить' })
    expect(button).toHaveClass('bg-destructive', 'h-8', 'w-full')
    expect(buttonVariants({ variant: 'outline', size: 'lg' })).toContain('border')
  })

  it('Card renders all its parts', () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title>Заголовок</Card.Title>
          <Card.Description>Описание</Card.Description>
        </Card.Header>
        <Card.Content>Текст</Card.Content>
        <Card.Footer>Подвал</Card.Footer>
      </Card.Root>,
    )
    expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument()
    expect(screen.getByText('Подвал')).toHaveAttribute('data-slot', 'card-footer')
  })

  it('Alert is announced and supports variants', () => {
    render(
      <Alert.Root>
        <Alert.Title>Внимание</Alert.Title>
        <Alert.Description>Детали</Alert.Description>
      </Alert.Root>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('ВниманиеДетали')
  })

  it('Avatar falls back to initials without an image', () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback>АБ</Avatar.Fallback>
      </Avatar.Root>,
    )
    expect(screen.getByText('АБ')).toBeInTheDocument()
  })

  it('Input and Field link label, control, description and error', () => {
    render(
      <>
        <Input aria-label="plain" />
        <Field.Root invalid>
          <Field.Label>Имя</Field.Label>
          <Field.Control />
          <Field.Description>Как в паспорте</Field.Description>
          <Field.Error match>Обязательное поле</Field.Error>
        </Field.Root>
      </>,
    )
    expect(screen.getByLabelText('plain')).toHaveAttribute('data-slot', 'input')
    const control = screen.getByLabelText('Имя')
    expect(control).toHaveAccessibleDescription(/Как в паспорте/)
    expect(screen.getByText('Обязательное поле')).toBeInTheDocument()
  })

  it('toast.success and toast.error show notifications', async () => {
    render(<ToastProvider>{null}</ToastProvider>)

    toast.success('Сохранено', 'Готово')
    toast.error('Сломалось')

    // each toast is also mirrored into an aria-live region, hence *All*
    expect(await screen.findAllByText('Сохранено')).not.toHaveLength(0)
    expect(await screen.findAllByText('Сломалось')).not.toHaveLength(0)
  })
})
