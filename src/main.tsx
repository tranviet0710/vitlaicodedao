import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from './contexts/LanguageContext';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

createRoot(document.getElementById("root")!).render(
  <>
    <LanguageProvider>
      <App />
      <Analytics/>
      <SpeedInsights/>
    </LanguageProvider>
  </>
);
