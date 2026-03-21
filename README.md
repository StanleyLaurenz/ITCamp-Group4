# ITCamp-Group4

This repository is set up as an `npm` workspace monorepo with a React frontend and a Node.js backend.

## Stack

- `apps/web`: Vite + React + TypeScript + Tailwind CSS
- `apps/api`: Express + TypeScript
- Root workspace scripts for local development and builds

## Repository Structure

```text
.
├── apps
│   ├── api
│   └── web
├── .nvmrc
├── package.json
└── README.md
```

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

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

## Environment Variables

### `apps/api/.env`

- `PORT`: API server port
- `CLIENT_ORIGIN`: allowed frontend origin for CORS

### `apps/web/.env`

- `VITE_API_BASE_URL`: backend base URL used by the frontend

## 👥 Participants

| Role    | Name         |
|---------|--------------|
| Mentor  | Winston      |
| Leader  | Stanley      |
| Member  | Shravanthiga |
| Member  | Sanjuvigasini|
| Member  | Monica       |
| Member  | Rivaldo      |
