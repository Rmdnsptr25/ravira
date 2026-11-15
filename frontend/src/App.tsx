import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AppProvider } from "./contexts/AppContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

function FaviconSetter() {
  useEffect(() => {
    const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><defs><linearGradient id="ravira-fav-top" x1="8" y1="22" x2="92" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0039FD"/><stop offset="52%" stop-color="#016BFC"/><stop offset="100%" stop-color="#02A9FD"/></linearGradient><linearGradient id="ravira-fav-leg" x1="34" y1="50" x2="86" y2="83" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0154FC"/><stop offset="48%" stop-color="#038BFD"/><stop offset="100%" stop-color="#00D5FE"/></linearGradient><linearGradient id="ravira-fav-dot" x1="17.65" y1="64.05" x2="17.65" y2="81.15" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0041FC"/><stop offset="100%" stop-color="#00D3FE"/></linearGradient></defs><path d="M 8 17 L 70.2 17 C 82.8 17 92 26.2 92 38.5 C 92 47.4 86.8 54.8 78.47 60.07 L 68.4 49.83 C 71.25 47.7 72.86 45.1 72.86 42.1 C 72.86 37.5 69.2 34.16 64.2 34.16 L 26.25 34.16 Z" fill="url(#ravira-fav-top)"/><path d="M 26.65 49.83 L 55.69 49.83 L 90.02 83.01 L 60.81 83.01 Z" fill="url(#ravira-fav-leg)"/><circle cx="17.65" cy="72.6" r="8.55" fill="url(#ravira-fav-dot)"/></svg>`;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link") as HTMLLinkElement;
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
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
