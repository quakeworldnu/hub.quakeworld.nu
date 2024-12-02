# QuakeWorld Hub [![Build and deploy](https://github.com/quakeworldnu/hub.quakeworld.nu/actions/workflows/deploy.yml/badge.svg)](https://github.com/quakeworldnu/hub.quakeworld.nu/actions/workflows/deploy.yml)

> Live games, streams, demos and more.

## Stack

* **Website**: HTML + [TailWind CSS](https://tailwindcss.com/)
* **JavaScript app**: es6/react/redux, built using [Vite](https://vitejs.dev/)

## Data sources

The backend API is located at https://hubapi.quakeworld.nu/v2/ ([source code](https://github.com/vikpe/qw-hub-api))

* **Server info**: Queried using [serverstat](https://github.com/vikpe/serverstat)

## Development

### Setup

1. `git clone git@github.com:quakeworldnu/hub.quakeworld.nu.git`
   2`cd hub.quakeworld.nu`
3. `pnpm install`

### Local development

Launch dev server at `http://localhost:5173` with HMR-enabled.

```
pnpm dev
```

### Build

Build app to `/dist`

```
pnpm build
```

## Related projects

* [QW Hub API](https://github.com/vikpe/qw-hub-api)
* [serverstat](https://github.com/vikpe/serverstat)
* [masterstat](https://github.com/vikpe/masterstat)
