import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QueryClientProvider,QueryClient } from "@tanstack/react-query";
import "./index.css";
import { Provider } from "react-redux";
import {store} from './Redux/store.js';
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
<Provider store={store}>
<QueryClientProvider client={queryClient}>
      
   
 <React.StrictMode>
    <App />
  </React.StrictMode>
  </QueryClientProvider>
  </Provider>
);
