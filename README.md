# Trippa

A Singapore travel app designed to help travelers easily explore and navigate the city by providing essential tools and information in one platform.

## Contents

- [Description](#description)
- [Project Structure](#project-structure)
- [How to Use The App](#how-to-use-the-app)
- [Notes](#notes)
- [Team](#team)

## Description

The app allows users to sign up and sign in, then access a clean interface with a navbar featuring sign-out and a favorites (love) icon. It includes a hero section as the main landing page, followed by an interactive map where users can view locations through markers, apply filters, check weather conditions, and click on markers to see detailed information. Each location page provides descriptions, nearby MRT stations, and a map view for better navigation. Users can search for places and save their favorite locations, which are then organized in a dedicated saved page displaying their collections. Overall, the app integrates multiple pages—such as the hero section, map view, location details, and saved collections—to create a seamless and user-friendly travel experience in Singapore. The project has a Next.js frontend and an Express backend inside one npm workspace repo.

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

### Tech Stack

- `apps/web`: Next.js, React, TypeScript, Tailwind CSS, Supabase auth, Leaflet
- `apps/api`: Express, TypeScript
- Root workspace: npm workspaces + concurrent dev scripts

### Main Pages

- `/`: landing page
- `/location`: browse and filter attractions
- `/map`: interactive map with landmarks, taxis, saved items, and MRT
- `/saved`: saved attractions for logged-in users
- `/login`: login and reset request
- `/signup`: register account
- `/reset-password`: set a new password from Supabase recovery flow

### Backend Endpoints Used

- `GET /api/health`
- `GET /api/attractions`
- `GET /api/taxi`
- `GET /api/mrt`

The weather panel in the frontend uses the internal Next.js route at `apps/web/src/app/weather/route.ts`.

### Environment Variables

#### `apps/api/.env`

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
PEXELS_API_KEY=your-pexel-api-key
```

#### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-publishable-key
```

## How to Use The App

### Option 1: Use the Hosted Version

Click on this link: https://trippa.up.railway.app/

### Option 2: Run locally

Follow these steps to set up and run the app on your machine:

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

#### 2. Install Dependencies

Install all the required packages:

```bash
npm install
```

#### 3. Configure Environment Variables

Create environment files from the examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

**Note**: Make sure to update `.env` files with the required values before running the app

#### 4. Build The Project

Build the application to make sure everhting is set up correctly:

```bash
npm run build
```

#### 5. Run The App

Run both apps together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:web
npm run dev:api
```

## Notes

- Frontend default URL: `http://localhost:3000`
- Backend default URL: `http://localhost:3001`
- Supabase is used for authentication and saved locations
- Attraction, taxi, MRT, and weather data come from the backend or public Singapore data endpoints used by the app (data.gov.sg)

## Live deployed link (Railway)

## Known limitations and future improvements

One limitation of our app is the level of detail available on the location pages, which is primarily constrained by the limitations of the external APIs we currently use. Many free or basic-tier APIs provide restricted datasets, meaning we are only able to display general information rather than comprehensive details such as opening hours, reviews, or real-time updates. Additionally, while we integrated Pexels to enhance the visual experience, the images are not always location-specific, which can result in visuals that do not accurately represent the actual place.

For future improvements, we aim to integrate more robust and specialized location-based APIs that offer richer and more reliable data, even if it requires moving to paid services. This would allow us to provide more accurate, detailed, and dynamic information for each location. Furthermore, we plan to replace or supplement Pexels with APIs that provide verified, location-specific images to improve authenticity. Enhancing data accuracy, expanding content depth, and improving visual relevance will significantly elevate the overall user experience.

## Team

| Role        | Name          |
| ----------- | ------------- |
| Mentor      | Winston       |
| Leader      | Stanley       |
| Design Lead | Sanjuvigasini |
| Tech Lead   | Rivaldo       |
| Developer   | Monica        |
| Developer   | Shravanthiga  |

# Presentation Materials

https://drive.google.com/drive/folders/1L5avBcUzWSvj2bdi1BEPpIeL8XD2qXT6
