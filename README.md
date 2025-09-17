# DUCSU Election Website 2025

## Features

### Candidate Listing Pages

- **`/candidates` (Browse Candidates):** Displays all candidates with a refined visual format, including circular images with placeholder logic, structured candidate information, vote counts in bold red text below ballot numbers, and the human-readable position name next to the candidate's name. Includes a home icon for easy navigation.
- **`/candidates-by-position` (All Candidates by Position):** Groups candidates by their respective positions. Each position group initially shows 5 candidates with a "Show All/Show Less" toggle. Candidate cards feature thicker, darker borders with a hover background effect. Includes a home icon for easy navigation.

### Winner List Page

- **`/winnerlist` (Winners):** A new page displaying the top candidates for each position, determined by vote counts. It shows the top 1 candidate for most positions and the top 13 for the 'Member' position. Each member candidate is displayed in a distinct box with a "Member #[number]" label. The page also includes a summary of total voters, casting votes, and turnout, along with a home button.

### Backend Enhancements

- **`/api/winners` Endpoint:** A new API endpoint to fetch winner data, with specific logic to retrieve top 1 candidate for general positions and top 13 for 'member'.
- **Sorting Logic:** Implemented sorting for candidate lists by `votesCount` (descending) and for position groups by `priority` (ascending) and `count` (descending).
- **Data Model Alignment:** Ensured consistency in `positionKey` and `votesCount` across frontend, backend, and database model.

## Prerequisites

- Node 18+
- MongoDB Atlas cluster

## Setup

1. `cp env.example .env.local` and fill values.
2. `npm i`
3. `npm run dev`

## Usage

- **Home Page (`/`):** Now directly displays the `WinnerListPage`.
- **Browse Candidates (`/candidates`):** View all candidates with detailed information and filters.
- **All Candidates by Position (`/candidates-by-position`):** View candidates grouped by position with expand/collapse functionality.
- **Winners (`/winnerlist`):** See the top candidates for each position.

## API Endpoints

- **`/api/candidates`:** Fetches all candidates, supporting filters by position, name (`q`), ballot number, panel ID, department, and hall. Now returns `votesCount` and `positionKey`.
- **`/api/winners` (NEW):** Retrieves top candidates by position based on `votesCount`. Returns 1 winner for most positions and 13 for the 'member' position.
- Admin API: `curl -H "x-api-key: $ADMIN_API_KEY" -H 'content-type: application/json' -X POST \ https://<vercel-app>/api/import -d @candidates.json`

## Search & Filters

- `/api/candidates?position=vice_president&q=জাহিদ&panelId=Combined&hall=সূর্যসেন হল`

## Panel Rules

- One per position except `member` up to 13 total (layers 6+7).

## Deploy (Vercel)

1. Push to GitHub.
2. Import repo in Vercel.
3. Add env vars: `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `ADMIN_API_KEY`.
4. Deploy.

## Security Notes

- Import route protected by `x-api-key`.
- JWT cookie (`sid`) is HttpOnly, Secure, 90d.
- Rate limit /api/import and /api/panel if needed via Vercel Edge Middleware or 3rd‑party.

## Future Enhancements

- Auth for Admin via passwordless magic link.
- Real images (S3/Cloudinary) + moderation.
- Server Actions for direct DB reads (careful on Vercel with cold starts).
- Add positions for layers 4 & 5 from the official sheet and update `positions.ts`.
- i18n (bn/en) toggle.
