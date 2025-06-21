import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initAppState } from "../store/appStateStore";

export function RjsRouteHandler() {
  const location = useLocation();
  const processingRef = useRef(false);
  const lastLocationRef = useRef<string>("");

  useEffect(() => {
    const currentLocationKey = `${location.pathname}${location.search}${location.hash}`;

    // Prevent duplicate processing
    if (
      processingRef.current ||
      lastLocationRef.current === currentLocationKey
    ) {
      return;
    }

    processingRef.current = true;
    lastLocationRef.current = currentLocationKey;

    // Initialize page state from current URL whenever route changes
    const state = initAppState(window.location);
    console.log("[RouteChangeHandler] URL updated:", window.location, state);

    processingRef.current = false;
  }, [location.pathname, location.search, location.hash]);

  return null; // This component doesn't render anything
}
