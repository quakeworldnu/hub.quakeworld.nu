import React from 'react'
import ReactDOM from 'react-dom/client'
import store from "./js/store.js";
import { Provider } from "react-redux";
import App from "./js/App.jsx";
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
)
