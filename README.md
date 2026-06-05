# Drops

Drops is a small Next.js app for comparing World of Warcraft droptimizer report data across raid bosses, players, item slots, and armor types. It pulls a curated list of Raidbots report IDs from a published Google Sheet, loads each report through local API routes, validates that the report matches the expected sim settings, and presents the results as a table, list, or chart.

This is an older hobby project, but the code aims to keep the moving pieces clear: external data is normalized in one utility layer, UI state lives in a typed Redux Toolkit slice, and user preferences are persisted in local storage and cookies so server-rendered defaults match the client.

## Features

- Fetches report IDs from a published Google Sheets CSV.
- Loads Raidbots droptimizer JSON through Next.js API routes.
- Filters stale or invalid reports before they reach the UI.
- Supports boss and player grouping.
- Supports table, list, and chart views.
- Filters by armor type and item slot.
- Persists theme and data-view preferences.

## Stack

- Next.js Pages Router
- React
- TypeScript
- Redux Toolkit
- Material UI
- MUI X Charts
- csv-parse
- date-fns

## Local Development

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

Run checks:

```bash
yarn lint
yarn build
```

## Data Flow

1. `/api/reports` fetches and parses the published Google Sheets CSV.
2. The client requests each report ID through `/api/report`.
3. `/api/report` fetches the Raidbots `data.json` payload.
4. `src/lib/utils.ts` validates report freshness, difficulty, fight style, target count, and fight duration.
5. Valid reports are transformed into boss-grouped and player-grouped rows for the UI.

## Notes

Raidbots reports age out of usefulness quickly for this workflow, so stale reports are intentionally ignored. The project also keeps its TypeScript migration pragmatic: most app state and local data structures are typed, while the external Raidbots response is represented only by the fields this app actually consumes.
