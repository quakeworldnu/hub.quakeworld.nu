# QuakeWorld Server Browser
> To the Moon! 🚀

## Info
* **Temporary URL**: https://qwsb-4b8ab.web.app/
* **Components**: 
  * Website (HTML): Jekyll + Bulma (front-end framework)
  * JavaScript app: es6/react/redux
    
* **Data source**:
  * **Proxied** (bypass CORS issues): https://api.allorigins.win/raw?url=https://badplace.eu/api/v2/serverbrowser/busy?[CACHE_BUST_KEY]
  * **Original**: https://badplace.eu/api/v2/serverbrowser/busy

---

## Install
1. `git clone git@github.com:vikpe/qw-server-browser.git`
1. `cd qwsb`   
1. `yarn install`

---

## Development
Launch dev server at `http://localhost:3000` with HMR-enabled.
```
yarn watch
```

---

## Production
Build app to `/build`
```
yarn build
```
