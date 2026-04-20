"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, trackNavigation } from "./analytics";

/**
 * Hook to automatically track page views on route changes
 */
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams]);
}

/**
 * Hook to track scroll depth
 */
export function useScrollTracking(pageName: string) {
  const depthReached = useRef(new Set<number>());
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !depthReached.current.has(threshold)) {
          depthReached.current.add(threshold);
          trackNavigation.scrollDepth(threshold, pageName);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      
      // Track time on page when component unmounts
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      if (timeSpent > 0) {
        trackNavigation.timeOnPage(timeSpent, pageName);
      }
    };
  }, [pageName]);
}

/**
 * Hook to track visibility changes (user switching tabs)
 */
export function useVisibilityTracking(pageName: string) {
  const visibilityStartTime = useRef<number>(Date.now());
  const totalVisibleTime = useRef<number>(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden
        const visibleDuration = Date.now() - visibilityStartTime.current;
        totalVisibleTime.current += visibleDuration;
      } else {
        // Tab became visible
        visibilityStartTime.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      // Track total visible time
      if (!document.hidden) {
        totalVisibleTime.current += Date.now() - visibilityStartTime.current;
      }
      
      const totalSeconds = Math.round(totalVisibleTime.current / 1000);
      if (totalSeconds > 0) {
        trackNavigation.timeOnPage(totalSeconds, `${pageName}_visible_time`);
      }
    };
  }, [pageName]);
}

/**
 * Combined tracking hook for convenience
 */
export function useAnalytics(pageName: string) {
  usePageTracking();
  useScrollTracking(pageName);
  useVisibilityTracking(pageName);
}
