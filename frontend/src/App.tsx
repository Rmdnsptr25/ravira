import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AppProvider } from "./contexts/AppContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

function FaviconSetter() {
  useEffect(() => {
    const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="rg" x1="5" y1="5" x2="95" y2="95" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0055FF"/><stop offset="55%" stop-color="#0099EE"/><stop offset="100%" stop-color="#00C8FF"/></linearGradient></defs><path d="M 8 8 L 78 8 Q 88 8 88 30 Q 88 54 54 58 L 26 58 L 26 66 L 8 66 Z M 39 20 L 70 34 L 39 48 Z" fill="url(#rg)" fill-rule="evenodd"/><path d="M 34 58 L 56 58 L 90 92 L 68 92 Z" fill="url(#rg)"/><circle cx="17" cy="82" r="9" fill="url(#rg)"/></svg>`;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link") as HTMLLinkElement;
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,${encodeURIComponent(svgFavicon)}`;
    document.title = "Ravira — AI Recruitment Ecosystem";
  }, []);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <FaviconSetter />
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AppProvider>
    </ErrorBoundary>
  );
}
