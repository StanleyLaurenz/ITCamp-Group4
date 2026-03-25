# ITCamp-Group4

This repository is set up as an `npm` workspace monorepo with a Next.js frontend and a Node.js backend.

## Stack

- `apps/web`: Next.js + React + TypeScript + Tailwind CSS
- `apps/api`: Express + TypeScript
- Root workspace scripts for local development and builds

## Repository Structure

```text
.
├── apps
│   ├── api
│   │   └── src
│   └── web
│       └── src
│           ├── app
│           ├── components
│           ├── features
│           ├── layouts
│           └── lib
├── .nvmrc
├── package.json
└── README.md
```

The frontend uses the Next.js App Router from `apps/web/src/app`. Do not create a parallel `apps/web/app` or `src/pages` router unless the team intentionally decides to migrate routing.

## Requirements

- Node.js `22.x` recommended via `.nvmrc`
- `npm` as the package manager

## Setup

```bash
nvm use
npm install
```

Copy the example environment files before starting:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Default values:

- `apps/web/.env`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`
- `apps/api/.env`: `PORT=3001`, `CLIENT_ORIGIN=http://localhost:3000`

## Run The Apps

Start both apps:

```bash
npm run dev
```

Start them separately:

```bash
npm run dev:web
npm run dev:api
```

## Build

```bash
npm run build
```

## Default Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

## Team Conventions

- Build frontend routes under `apps/web/src/app`
- Build frontend UI and feature code under `apps/web/src/components` and `apps/web/src/features`
- Build backend code under `apps/api/src`
- Do not edit files inside `node_modules`, `.next`, or `dist`
- Use `npm run dev` from the repository root for day-to-day development

## Environment Variables

### `apps/api/.env`

- `PORT`: API server port
- `CLIENT_ORIGIN`: allowed frontend origin for CORS

### `apps/web/.env`

- `NEXT_PUBLIC_API_BASE_URL`: backend base URL used by the frontend

## 👥 Participants

| Role    | Name         |
|---------|--------------|
| Mentor  | Winston      |
| Leader  | Stanley      |
| Member  | Shravanthiga |
| Member  | Sanjuvigasini|
| Member  | Monica       |
| Member  | Rivaldo      |
