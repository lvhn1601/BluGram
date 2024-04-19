import ReactDOM from "react-dom/client";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./lib/react-query/QueryProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryProvider>
);
