# QuakeWorld Hub [![Build and deploy](https://github.com/quakeworldnu/hub.quakeworld.nu/actions/workflows/deploy.yml/badge.svg)](https://github.com/quakeworldnu/hub.quakeworld.nu/actions/workflows/deploy.yml)
> Live games, streams, news and more.

## Stack
* **Website**: HTML + [TailWind CSS](https://tailwindcss.com/)
* **JavaScript app**: es6/react/redux, built using [Vite](https://vitejs.dev/)

## Data sources
The backend API is located at https://hubapi.quakeworld.nu/v2/ ([source code](https://github.com/vikpe/qw-hub-api))

* **Server info**: Queried using [serverstat](https://github.com/vikpe/serverstat)
* **Events**: Scraped from [QuakeWorld Wiki](https://www.quakeworld.nu/wiki/Overview) main page.
* **News** and **forum posts**: Scraped from [QuakeWorld.nu](https://www.quakeworld.nu) main page.

## Development

### Setup
1. `git clone git@github.com:quakeworldnu/hub.quakeworld.nu.git`
3. `cd hub.quakeworld.nu`   
3. `yarn install`

### Local development
Launch dev server at `http://localhost:5173` with HMR-enabled.
```
yarn dev
```

### Build
Build app to `/dist`
```
yarn build
```

## Related projects
* [QW Hub API](https://github.com/vikpe/qw-hub-api)
* [serverstat](https://github.com/vikpe/serverstat)
* [masterstat](https://github.com/vikpe/masterstat)
