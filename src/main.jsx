import React from 'react'
import ReactDOM from 'react-dom/client'
import store from "./js/features/Browser/store.js";
import Browser from "./js/features/Browser/Browser.jsx";
import { Provider } from "react-redux";
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Browser />
    </Provider>
  </React.StrictMode>
)
