# ACG Landing

Лендінговий сайт компанії **ACG** на [Next.js](https://nextjs.org) з інтеграцією [Sanity](https://www.sanity.io/) для контенту та керування в студії.

## Технології

- **Next.js** 16, **React** 19
- **TypeScript**
- **Tailwind CSS** 4
- **Sanity** (CMS, студія за маршрутом `/studio`)
- **Framer Motion**, плавний скрол **Lenis**
- Шрифти через `next/font` (Geist)

## Вимоги

- Node.js з підтримкою версій Next.js/React у цьому репозиторії
- Менеджер пакетів (за замовчуванням використовується **npm**)

## Налаштування середовища

Створіть файл `.env.local` у корені проєкту та додайте змінні для Sanity:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-09
```

`NEXT_PUBLIC_SANITY_API_VERSION` необов’язкова; якщо її немає, використовується значення за замовчуванням з `sanity/env.ts`.

## Запуск

Встановлення залежностей:

```bash
npm install
```

Режим розробки (за замовчуванням сервер піднімається на **порт 3002**):

```bash
npm run dev
```

У браузері відкрийте [http://localhost:3002](http://localhost:3002).

## Інші скрипти

| Команда        | Призначення                    |
|----------------|--------------------------------|
| `npm run build` | Продуктовий збір               |
| `npm run start` | Запуск після збірки            |
| `npm run lint`  | Перевірка ESLint               |

Після локального або продакшен-збору Sanity Studio доступна за адресою `/studio` (наприклад, `http://localhost:3002/studio` у dev).

## Документація

- [Next.js](https://nextjs.org/docs) — можливості фреймворку та деплой
- [Sanity](https://www.sanity.io/docs) — схеми, GROQ, студія

> У цьому репозиторії використовується актуальна гілка Next.js з окремими змінами в API порівняно зі старими гайдами; перед змінами варто перевірити відповідні розділи в `node_modules/next/dist/docs/` (див. також `AGENTS.md`).

## Деплой

Зручні варіанти для Next.js-додатків описані в [офіційній документації деплою](https://nextjs.org/docs/app/building-your-application/deploying), зокрема платформа Vercel.
