# DeadZone - Architecture

Detail the full directory layout and responsibilities.

## Frontend Layering (`frontend/src/`)
- `components/` — Modular UI blocks (SpotCard, MetricBadge, StatusPill, FloorRow).
- `screens/` — Screen components mapped to navigation routes.
- `navigation/` — Bottom Tab Navigator + Native Stack Navigator.
- `services/` — Dedicated API/data layer; screens MUST NOT contain direct `fetch()` calls.
- `hooks/` — Custom React hooks (e.g., `useSavedSpots`, `useSpotFilter`).
- `types/` — TypeScript interfaces (`User`, `Building`, `Floor`, `Spot`, `Report`, `SavedSpot`, `MatchPreferences`).
- `data/` — Realistic campus mock data (Tech Park, Central Library, University Block).
- `utils/` — Weighted spot-matching algorithm, formatting, and color helpers.

## Backend Layering (`backend/src/`)
- `controllers/`, `routes/`, `services/`, `middleware/`, `db/`, `types/`.
- Business logic stays in `services/`, database queries in `db/`, request handling in `controllers/`.
