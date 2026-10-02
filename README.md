# MAX · GREEN-API chat

Веб-чат для мессенджера MAX поверх [GREEN-API](https://green-api.com/max): входишь с данными инстанса, пишешь на номер телефона и получаешь ответы. Выглядит как [web.max.ru](https://web.max.ru/).

**Демо:** https://stanislav1275.github.io/green-api-max/ — работает без инстанса, вместо GREEN-API в браузере крутится мок.
<img width="706" height="396" alt="image" src="https://github.com/user-attachments/assets/22731587-70bb-4d5e-9d3f-bdb5fb45e5a3" />


## Что умеет

- Вход по `apiUrl`, `idInstance`, `apiTokenInstance`. Сразу проверяет, что инстанс авторизован и настроен на приём уведомлений, и подсказывает, что поправить.
- Новый чат по номеру — в любом формате: `+7 999 123-45-67`, `8 999…`, `79991234567`.
- Отправка текста ([`SendMessage`](https://green-api.com/v3/docs/api/sending/SendMessage/)) и получение ответов через [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/).
- Русский и английский интерфейс.
- Адаптивная вёрстка — работает и на телефоне.

## Запуск

```bash
nvm use                                   # Node 24
npm ci
cp .env.example .env.development          # настройки dev-сервера
npm run dev
```

Хочешь сразу в демо — `npm run dev:demo`. В демо подходят любые данные, кнопка «Подставить» заполнит форму, собеседник отвечает эхом.

Демо-режим включается иконкой-колбой на экране входа. Будет ли колба, решает `VITE_DEMO_MODE`:

| Значение    | Колба | Демо при первом входе |
| ----------- | ----- | --------------------- |
| `off`       | нет   | нет                   |
| `available` | есть  | выключено             |
| `on`        | есть  | включено              |

### Реальный инстанс

HTTP API отдаёт уведомления, только если в [консоли](https://console.green-api.com) у инстанса:

- **пустой** `webhookUrl`;
- включены входящие сообщения и уведомления об отправке через API.

## Как сделано

### API из OpenAPI-спеки

Я описал нужную часть GREEN-API в [`api/green-api.yaml`](api/green-api.yaml) (5 методов), а весь клиентский код по ней генерирует [Kubb](https://kubb.dev):

```
api/green-api.yaml
        │  npm run api:gen
        ▼
src/shared/api/gen/
  ├─ types/    TypeScript-типы запросов и ответов
  ├─ zod/      zod-схемы — ими валидируются формы и входящие уведомления
  ├─ clients/  fetch-функции
  ├─ hooks/    queryOptions / mutationOptions для TanStack Query
  └─ mocks/    faker-фабрики для тестов и демо
```

Руками сверху написаны только обёртка с таймаутами и ретраями ([`green-api.ts`](src/shared/api/green-api.ts)), цикл опроса и MSW-хендлеры (плагин Kubb для MSW ломает путь `waInstance{idInstance}`). Сгенерированный код лежит в репо, а CI проверяет, что он совпадает со спекой: поправил yaml и забыл `api:gen` — сборка красная.

### Получение сообщений

Один последовательный long-poll: `receiveNotification` (ждёт до 20 с) → обработать → `deleteNotification`. Цикл живёт в хуке, останавливается через `AbortController` при выходе и не запускается дважды в StrictMode.

### Ошибки

Любая ошибка запроса превращается в один тип `AppError` ([`normalize-error.ts`](src/shared/api/errors/normalize-error.ts)): ошибки полей подсвечиваются в форме, остальное уходит в toast с понятным текстом. Мутации показывают toast сами, вручную ничего ловить не надо.

Запросы обрываются через 30 с. Безопасные запросы повторяются с нарастающей паузой, а `sendMessage` — нет, иначе сообщение может уйти дважды.

### i18n

i18next, словари [`ru.json`](src/shared/lib/i18n/locales/ru.json) и [`en.json`](src/shared/lib/i18n/locales/en.json).

- Ключи типизированы: опечатка в `t('…')` не скомпилируется.
- zod-схемы и ошибки возвращают ключи, а не готовый текст — переводится при показе, поэтому смена языка сразу меняет и сообщения валидации.
- ESLint не пропустит непереведённую строку в JSX, `aria-label`, `placeholder`, `title`, `alt`.
- Язык запоминается, `<html lang>` и заголовок вкладки меняются вместе с ним.

### UI

- Base UI + Tailwind v4 + cva — свой UI-kit в стиле shadcn/ui, компоненты лежат в проекте ([`src/shared/ui`](src/shared/ui)).
- Формы на react-hook-form + zod, схемы берутся из Kubb и дополняются клиентскими правилами.
- React Compiler — без ручных `useMemo` / `useCallback`.
- Заголовок и description страницы — нативными тегами React 19, у открытого чата во вкладке видно имя.

### Архитектура

[Feature-Sliced Design](https://feature-sliced.design/), границы слоёв проверяют `eslint-plugin-boundaries` и `steiger`.

```
src/
├─ app/        провайдеры, стили, демо-режим
├─ pages/      sign-in, messenger
├─ widgets/    список чатов, окно чата
├─ features/   вход, выход, новый чат, отправка, получение
├─ entities/   session, chat
└─ shared/     api (+ gen), mocks, lib (i18n, phone, …), ui
```

Состояние — zustand с persist (сессия, чаты, язык), запросы — TanStack Query.

## С чем пришлось повозиться

- **Ответ приходит «не в тот» чат.** Пишешь на `79991234567@c.us`, а ответ из MAX приходит с другим `chatId` вроде `10000000`. Поэтому чат ищется по номеру отправителя, а связка «номер ↔ chatId» запоминается ([`chat-store.ts`](src/entities/chat/model/chat-store.ts)).
- **Очередь встаёт колом.** Пока уведомление не удалено, GREEN-API отдаёт его снова и снова. Поэтому удаляется каждое — даже непонятное или битое ([`poll-notifications.ts`](src/features/receive-messages/model/poll-notifications.ts)).
- **Своё сообщение приходит обратно.** После отправки GREEN-API присылает его же как исходящее. Дубли склеиваются по `idMessage`.
- **Уведомления — чужие данные.** Каждое проверяется zod-схемой, мусор не ломает чат.
- **Задан webhook — тишина.** HTTP API тогда ничего не отдаёт, поэтому настройки проверяются ещё при входе.
- **Отвалилась сеть.** Опрос не долбит сервер, а ждёт всё дольше, до 30 с.
- **Почему не WebSocket.** В MAX API его нет: есть HTTP API и webhook, а webhook требует бэкенда.

### Безопасность

- **Токен** лежит в `localStorage`, чтобы вход переживал перезагрузку. Бэкенда нет, так что httpOnly-cookie не сделать. Для общих компьютеров достаточно сменить хранилище на `sessionStorage` в [`session-store.ts`](src/entities/session/model/session-store.ts). «Выйти» стирает и токен, и историю.
- **XSS.** Текст сообщений выводится только как текст, без `dangerouslySetInnerHTML`.
- **CSP.** В прод-сборке есть строгий Content-Security-Policy: никаких inline-скриптов и стилей, запросы — только к `*.green-api.com`. Даже если XSS случится, токен не утечёт на чужой сервер. E2E гоняются на прод-сборке и падают, если CSP что-то блокирует.
- **apiUrl** принимается только по HTTPS и только на домене GREEN-API — токен идёт прямо в URL, по HTTP или «не туда» его отправлять нельзя.
- **Зависимости.** CI запускает `npm audit`, Dependabot раз в неделю предлагает обновления.

## Тесты

Сценарии и тест-кейсы — в [`docs/user-stories.md`](docs/user-stories.md), ID кейса есть в названии теста.

| Уровень        | Где                           | Что                                                      |
| -------------- | ----------------------------- | -------------------------------------------------------- |
| Unit           | рядом с кодом, `*.test.ts(x)` | утилиты, схемы, сторы, парсинг, ошибки, опрос, UI-kit    |
| Интеграционные | `src/app/stories/`            | каждая user story целиком: приложение в jsdom + MSW-мок  |
| E2E            | `e2e/` (Playwright)           | основной сценарий, перезагрузка, выход, мобильная ширина |

```bash
npm test
npm run test:coverage
npx playwright install chromium && npm run test:e2e
```

## CI/CD

GitHub Actions:

- **`ci.yml`** — на push в `dev` и на каждый PR. Параллельно: `npm audit`, Prettier, ESLint, steiger, `tsc`, сверка `api:gen` со спекой · Vitest с порогом покрытия 100% · Playwright · сборка.
- **`deploy.yml`** — на push в `main`. Тот же CI, затем демо-сборка уезжает на GitHub Pages.

## Git flow

- `main` — релизы, `dev` — разработка.
- Ветки от `dev`: `feature/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`, `test/*`; срочные правки — `hotfix/*` от `main`.
- `main` защищена: только через PR и только с зелёным CI. Релиз — PR `dev` → `main` с названием `chore(release): x.y.z`.
- Коммиты — [Conventional Commits](https://www.conventionalcommits.org/). Husky проверяет сообщение коммита, формат и линт изменённых файлов и имя ветки перед пушем.

## Скрипты

| Команда                      | Что делает                         |
| ---------------------------- | ---------------------------------- |
| `npm run dev` / `dev:demo`   | dev-сервер / он же в демо-режиме   |
| `npm run build`              | проверка типов + прод-сборка       |
| `npm run lint` / `lint:fsd`  | ESLint / проверка FSD              |
| `npm run typecheck`          | `tsc -b`                           |
| `npm test` / `test:coverage` | Vitest                             |
| `npm run test:e2e`           | Playwright в демо-режиме           |
| `npm run api:gen`            | перегенерировать клиент из OpenAPI |
