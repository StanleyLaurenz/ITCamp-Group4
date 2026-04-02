# Submission Notes

This repo was cleaned to make the assignment submission easier to read and justify.

## What Was Cleaned

- Removed old starter/demo files that were not connected to any live page
- Removed one unused backend weather endpoint that the frontend no longer calls
- Renamed a few files to make component naming more consistent
- Removed dead imports, generated artifacts, and outdated setup notes

## What Was Intentionally Kept

- The current feature-based structure under `apps/web/src/features`
- The Next.js App Router structure under `apps/web/src/app`
- The internal weather route used by the frontend weather widget
- Public image assets that are still referenced by the UI

## Manual Setup Needed

- Add your own Supabase URL and publishable key to `apps/web/.env.local`
- Make sure `apps/api/.env` allows the frontend origin you are using locally

## Known Limits

- This cleanup focused on safe removal and clearer documentation
- Some UI files still contain simple student-level patterns and repeated styling because changing them further would risk breaking working features
- If secret keys were committed earlier in tracked `.env` files, those should be reviewed separately before final submission
