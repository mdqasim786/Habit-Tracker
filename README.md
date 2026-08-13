# Discipline ⚔️

A dark, focused habit tracker. Not a to-do list — a personal accountability system.
Complete every habit you scheduled for the day and you win the day; miss one and
the streak resets. Portfolio project built with a deliberately light stack.

## Stack

- **React + Vite + TypeScript** — near-instant dev server (`ready in ~400ms`)
- **Tailwind CSS v4** + hand-rolled shadcn-style components (`button`, `modal`, `menu`)
- **Framer Motion** — tick, streak, confetti micro-interactions
- **Firebase** — Firestore (data), Auth (Google + email/password), Hosting (deploy)
- **Recharts** — 30-day consistency chart on the profile page

No backend server: Firestore security rules scope every document to its owner, so the
schema is multi-user ready (`users/{uid}/habits`, `users/{uid}/completions`).

## Features

- **Habit builder** — add a habit like a notebook entry: title, color, icon, and the
  weekdays you're committing to (`Mon Wed Fri`, `every day`, …)
- **Today** — only what's due today, with a progress ring, springy tick animation, and
  a confetti burst when you clear the day
- **Calendar** — month grid colored by day status (complete / partial / missed / rest).
  Click any day to back-fill or edit ticks
- **Profile** — current & longest streak, all-time ticks, 30-day success rate chart,
  per-habit completion %, and a gamified discipline score
- **Streak logic** is a pure, unit-tested function: rest days (nothing scheduled) never
  break a streak, a missed day resets it, and "today" stays in-progress until the day
  resolves so your streak doesn't blink to zero every morning

## Get it running

1. `npm install`
2. Create a [Firebase](https://console.firebase.google.com) project and enable
   **Authentication** (Email/Password, optionally Google) and **Cloud Firestore**.
3. Copy `.env.example` → `.env.local` and fill in your web-app config values.
4. Deploy the rules: `npx firebase deploy --only firestore:rules`
5. `npm run dev` → open the printed URL

When Firebase isn't configured the app shows inline setup steps instead of failing.

## Scripts

| Command            | What it does              |
| ------------------ | ------------------------- |
| `npm run dev`      | Start the dev server      |
| `npm run test`     | Run streak/stats unit tests |
| `npm run build`    | Type-check + production build |
| `npm run preview`  | Serve the production build |
| `npm run lint`     | Oxlint                    |

## Deploy

```sh
npm run build
npx firebase login
npx firebase deploy
```

## Layout

```
src/
  lib/          types, date utils, firebase init, streak/stats logic (pure + tested)
  context/      AuthContext (firebase auth), DataContext (firestore CRUD + derived stats)
  components/   ui primitives, habit builder, today/widgets, layout shell
  pages/        Today, Calendar, Profile, Login, Setup
```