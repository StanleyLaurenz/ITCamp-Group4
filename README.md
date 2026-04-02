# Trippa

Trippa is a school project for exploring tourist attractions in Singapore. The project has a Next.js frontend and an Express backend inside one npm workspace repo.

## Tech Stack

- `apps/web`: Next.js, React, TypeScript, Tailwind CSS, Supabase auth, Leaflet
- `apps/api`: Express, TypeScript
- Root workspace: npm workspaces + concurrent dev scripts

## Project Structure

```text
.
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── config
│   │   │   ├── controllers
│   │   │   ├── middleware
│   │   │   ├── routes
│   │   │   └── server.ts
│   │   ├── .env.example
│   │   └── package.json
│   └── web
│       ├── public
│       ├── src
│       │   ├── app
│       │   ├── components
│       │   ├── context
│       │   ├── features
│       │   │   ├── location
│       │   │   └── map
│       │   ├── lib
│       │   ├── styles
│       │   └── utils
│       ├── .env.example
│       └── package.json
├── docs
│   └── submission-notes.md
├── package.json
└── README.md
```

## Main Pages

- `/`: landing page
- `/location`: browse and filter attractions
- `/map`: interactive map with landmarks, taxis, saved items, and MRT
- `/saved`: saved attractions for logged-in users
- `/login`: login and reset request
- `/signup`: register account
- `/reset-password`: set a new password from Supabase recovery flow

## Backend Endpoints Used

- `GET /api/health`
- `GET /api/attractions`
- `GET /api/taxi`
- `GET /api/mrt`

The weather panel in the frontend uses the internal Next.js route at `apps/web/src/app/weather/route.ts`.

## Environment Variables

### `apps/api/.env`

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-publishable-key
```
# Using the app

## 1. Setup
Install dependencies:
```bash
npm install
```
Create environment files from the examples:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```
**Note**: Don't forget to update ```.env``` files with the required values before running the app

## 2. Build
Build the application to make sure everything is OK
```bash
npm run build
```

## 3. Run The Project
Run both apps together:
```bash
npm run dev
```
OR

Run apps separately:
```bash
npm run dev:web
npm run dev:api
```



## Notes

- Frontend default URL: `http://localhost:3000`
- Backend default URL: `http://localhost:3001`
- Supabase is used for authentication and saved locations
- Attraction, taxi, MRT, and weather data come from the backend or public Singapore data endpoints used by the app

## Team

| Role | Name |
| --- | --- |
| Mentor | Winston |
| Leader | Stanley |
| Member | Shravanthiga |
| Member | Sanjuvigasini |
| Member | Monica |
| Member | Rivaldo |
