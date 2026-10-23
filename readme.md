# QuakeWorld Hub [![Build and deploy](https://github.com/quakeworldnu/hub.quakeworld.nu/actions/workflows/deploy.yml/badge.svg)](https://github.com/quakeworldnu/hub.quakeworld.nu/actions/workflows/deploy.yml)
> Live servers, QTV, streams, demos and more.

## Stack
* [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/), built with [Vite](https://vite.dev/) (one entry per page)
* [Tailwind CSS](https://tailwindcss.com/)
* [TanStack Query](https://tanstack.com/query) for data fetching
* [FTE](https://fteqw.org/) (WebAssembly) for the QTV and demo players
* [Biome](https://biomejs.dev/) for linting/formatting, [Vitest](https://vitest.dev/) for tests

## Data sources
* **Servers, players and streams**: QuakeWorld API at `https://api.quake.world/v1/` (e.g. [`/v1/servers`](https://api.quake.world/v1/servers))
* **Server locations**: [qw-servers-geoip](https://github.com/vikpe/qw-servers-geoip)
* **Demos / recent games**: [Supabase](https://supabase.com/) (game index) and CloudFront (demo files)
* **Scheduled games**: [QuakeWorld Game Scheduler](https://scheduler.quake.world)
* **QWLeague queue**: [QWLeague](https://qwleague.com)

## Development

### Setup
Requires Node.js 26 and [pnpm](https://pnpm.io/).

1. `git clone git@github.com:quakeworldnu/hub.quakeworld.nu.git`
2. `cd hub.quakeworld.nu`
3. `pnpm install`
4. `cp .env.local.example .env.local` and fill in the values

### Commands
| Command | Description |
|---|---|
| `pnpm dev` | Dev server at `http://localhost:5173` with HMR |
| `pnpm build` | Type check and build to `/dist` |
| `pnpm preview` | Serve the build locally |
| `pnpm test` | Run tests (with coverage) |
| `pnpm lint` | Lint |
| `pnpm format` | Format and fix lint issues |
| `pnpm bench` | Run benchmarks |
| `pnpm supabase:types` | Regenerate Supabase database types |

Tests are written in-source, at the bottom of the module they test (`if (import.meta.vitest) { ... }`).

### Deployment
Pushes to `main` are linted, tested, built and deployed to Firebase Hosting by [GitHub Actions](.github/workflows/deploy.yml).
