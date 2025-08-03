"use client";
import { useState, useEffect } from "react";

export const useIsMobileScreen = () => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);

    // Set initial width
    updateWidth();

    // Listen for resize
    window.addEventListener("resize", updateWidth);

    // Clean up
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return {
    isSmallMobile: width !== null && width <= 640,
    isMediumMobile: width !== null && width <= 768,
    isLargeMobile: width !== null && width <= 1024,
    isExtraLargeMobile: width !== null && width <= 1280,
    isDesktop: width !== null && width > 1280,
  };
};

export default useIsMobileScreen;
