'use client'
import { BREAKPOINTS } from "@/lib/constants";
import { getDeviceType } from "@/lib/helpers/helperActions";
import { useState, useEffect } from "react";

export const useScreenDetector = () => {
  const [resolution, setResolution] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    deviceType:
      typeof window !== "undefined"
        ? getDeviceType(window.innerWidth)
        : "desktop",
    isMobile:
      typeof window !== "undefined"
        ? window.innerWidth < BREAKPOINTS.mobile
        : false,
    isTablet:
      typeof window !== "undefined"
        ? window.innerWidth >= BREAKPOINTS.mobile &&
          window.innerWidth < BREAKPOINTS.tablet
        : false,
    isLaptop:
      typeof window !== "undefined"
        ? window.innerWidth >= BREAKPOINTS.tablet &&
          window.innerWidth < BREAKPOINTS.laptop
        : false,
    isDesktop:
      typeof window !== "undefined"
        ? window.innerWidth >= BREAKPOINTS.laptop
        : false,
  }));

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleResize = () => {
      // Debounce for performance
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const deviceType = getDeviceType(width);

        setResolution({
          width,
          height,
          deviceType,
          isMobile: width < BREAKPOINTS.mobile,
          isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
          isLaptop: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.laptop,
          isDesktop: width >= BREAKPOINTS.laptop,
        });
      }, 150);
    };

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.documentElement);

    // Fallback to window resize event
    window.addEventListener("resize", handleResize);

    return () => {
     if (timeoutId !== undefined) clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return resolution;
};
