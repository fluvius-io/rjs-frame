import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initializeFromBrowserLocation } from "../store/pageStore";

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

    const processRouteChange = () => {
      processingRef.current = true;
      lastLocationRef.current = currentLocationKey;

      // Initialize page state from current URL whenever route changes
      initializeFromBrowserLocation(window.location);
      console.log(
        "[RouteChangeHandler] URL updated:",
        window.location.pathname
      );

      processingRef.current = false;
    };

    processRouteChange();
  }, [location.pathname, location.search, location.hash]);

  return null; // This component doesn't render anything
}
