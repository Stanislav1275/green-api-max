# MAX · GREEN-API chat

Веб-клиент для отправки и получения текстовых сообщений в мессенджере MAX через [GREEN-API](https://green-api.com/max).
Внешний вид — по мотивам [web.max.ru](https://web.max.ru/), функциональность — минимальная по ТЗ.

## Что умеет

1. Вход по `apiUrl`, `idInstance`, `apiTokenInstance` — с проверкой, что инстанс готов принимать уведомления.
2. Новый чат по номеру телефона получателя (`+7 999 123-45-67`, `8 999…`, `79991234567` — всё нормализуется).
3. Отправка текста — [`SendMessage`](https://green-api.com/v3/docs/api/sending/SendMessage/).
4. Получение ответов — [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/) (`ReceiveNotification` + `DeleteNotification`).

## Быстрый старт

```bash
nvm use            # Node 24
npm ci
npm run dev        # с реальным инстансом
```

**Демо без инстанса** — GREEN-API подменяется MSW-моком прямо в браузере, собеседник отвечает эхом:

```bash
VITE_API_MOCKS=true npm run dev
```

В демо-режиме подойдут любые данные, например `https://api.green-api.com/v3` / `1101000001` / `token`.

### Настройка реального инстанса

HTTP API получает уведомления, только если в [настройках инстанса](https://console.green-api.com):

- `webhookUrl` — **пустой**;
- включены входящие уведомления и уведомления об отправке через API.

Приложение проверяет это при входе (`getStateInstance` + `getSettings`) и подсказывает, что поправить.

## Подводные камни ТЗ и как они решены

| Проблема                                                                                                                                   | Решение                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Чат создаётся по `79991234567@c.us`, а ответ из MAX приходит с числовым `chatId` (`"10000000"`) — наивное сравнение `chatId` теряет ответы | Чат находится по `senderPhoneNumber`, затем запоминается связка телефон ↔ MAX `chatId` ([`chat-store.ts`](src/entities/chat/model/chat-store.ts))                 |
| Очередь уведомлений FIFO: неудалённое уведомление приходит снова и блокирует остальные                                                     | Каждое уведомление удаляется в `finally` — даже неподдерживаемое или битое ([`poll-notifications.ts`](src/features/receive-messages/model/poll-notifications.ts)) |
| `receiveNotification` отдаёт одно уведомление за запрос                                                                                    | Строго последовательный long-poll (`receiveTimeout=20`), `AbortController` — без двойного цикла в StrictMode и после выхода                                       |
| Своё сообщение возвращается как `outgoingAPIMessageReceived`                                                                               | Дедупликация по `idMessage`, оптимистичная отправка сворачивается в одно сообщение                                                                                |
| Уведомления — внешние данные                                                                                                               | Валидация zod-схемой, сгенерированной из OpenAPI                                                                                                                  |
| При заданном `webhookUrl` HTTP API молчит                                                                                                  | Проверка настроек при входе                                                                                                                                       |
| Сбои сети                                                                                                                                  | Экспоненциальный backoff до 30 с                                                                                                                                  |
| WebSocket                                                                                                                                  | В MAX API его нет: только HTTP API и webhook; webhook требует бэкенд, ТЗ требует HTTP API                                                                         |

### Где хранится токен

`localStorage`: вход переживает перезагрузку. Бэкенда нет, поэтому httpOnly-cookie невозможна, и от XSS не спасает ни одно JS-хранилище — защита в том, что текст сообщений рендерится только как текст (React-экранирование, без `dangerouslySetInnerHTML`). Для общих компьютеров достаточно заменить хранилище на `sessionStorage` в [`session-store.ts`](src/entities/session/model/session-store.ts). Кнопка «Выйти» очищает и токен, и историю.

## Стек

- **React 19** + **React Compiler** (без ручных `useMemo`/`useCallback`), Vite 8, TypeScript strict
- **Feature-Sliced Design** — границы слоёв проверяют `eslint-plugin-boundaries` и `steiger`
- **Kubb** — из [`api/green-api.yaml`](api/green-api.yaml) генерируются типы, zod-схемы, fetch-клиент, TanStack Query options и faker-фабрики
- **Base UI** + Tailwind v4 + cva — композиционный UI-kit в подходе shadcn/ui (компоненты лежат в проекте, а не в `node_modules`)
- **react-hook-form** + `zodResolver`; схемы — из Kubb, расширенные клиентскими правилами
- **TanStack Query**, **zustand** (persist)
- **MSW** — мок GREEN-API для тестов и демо-режима; **Vitest** + Testing Library

## Архитектура

```
src/
├─ app/        # провайдеры, стили, демо-режим, выбор экрана
├─ pages/      # sign-in, messenger
├─ widgets/    # chat-sidebar, chat-window
├─ features/   # sign-in, sign-out, create-chat, send-message, receive-messages
├─ entities/   # session (креды), chat (чаты, сообщения, парсинг уведомлений)
└─ shared/
   ├─ api/     # клиент GREEN-API + gen/ (Kubb)
   ├─ mocks/   # MSW-мок GREEN-API
   ├─ lib/     # cn, phone, format, test
   └─ ui/      # UI-kit
```

Слой импортирует только нижележащие слои, слайс — только через `index.ts`.

## Скрипты

| Команда                      | Что делает                                       |
| ---------------------------- | ------------------------------------------------ |
| `npm run dev`                | dev-сервер                                       |
| `npm run build`              | typecheck + прод-сборка                          |
| `npm run lint` / `lint:fsd`  | ESLint (0 warnings) / steiger                    |
| `npm run typecheck`          | `tsc -b`                                         |
| `npm test` / `test:coverage` | Vitest                                           |
| `npm run api:gen`            | перегенерировать `src/shared/api/gen` из OpenAPI |

## Git flow

- `main` — релизы, `dev` — интеграция.
- Ветки от `dev`: `feature/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`, `test/*`; горячие правки — `hotfix/*` от `main`.
- Мерж только `--no-ff`; `dev` → `main` — релиз.
- Коммиты — [Conventional Commits](https://www.conventionalcommits.org/) (`feat(chat): …`, `fix: …`), проверяются commitlint.
- Husky: `pre-commit` — ESLint + Prettier по изменённым файлам, `commit-msg` — commitlint, `pre-push` — проверка имени ветки.
