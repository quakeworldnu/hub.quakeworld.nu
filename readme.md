# QuakeWorld Hub [![Build and deploy](https://github.com/vikpe/hub.quakeworld.nu/actions/workflows/deploy.yml/badge.svg)](https://github.com/vikpe/hub.quakeworld.nu/actions/workflows/deploy.yml)
> To the Moon! 🚀

## Info
* **Components**: 
  * Website: HTML + [Bulma](https://bulma.io/) (front-end framework)
  * JavaScript app: es6/react/redux, built using [Vite](https://vitejs.dev/)
* **Backend API**: `https://metaqtv.quake.se/v2/` (under development)

## Data sources
The backend API is located at https://metaqtv.quake.se/v2/ (will be moved to quakeworld.nu soon)

* **Server info**: Queried using [serverstat](https://github.com/vikpe/serverstat)
* **Events**: Scraped from [QuakeWorld Wiki](https://www.quakeworld.nu/wiki/Overview) main page.
* **News** and **forum posts**: Scraped from [QuakeWorld.nu](https://www.quakeworld.nu) main page.

---

## Install
1. `git clone git@github.com:vikpe/qw-hub.git`
1. `cd qwsb`   
1. `yarn install`

---

## Development
Launch dev server at `http://localhost:3000` with HMR-enabled.
```
yarn dev
```

---

## Production
Build app to `/build`
```
yarn build
```
