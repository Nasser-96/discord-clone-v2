"use client";

import { useEffect, useRef } from "react";

export const useLoadMoreScrollBottom = (
  isLoading: boolean,
  loadMore: () => void
) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      // When using flex-col-reverse, bottom is scrollTop === 0
      if (el.scrollTop === 0) {
        if (isLoading) return; // Prevent loading more while already loading
        loadMore();
      }
    };

    // Attach scroll listener
    el.addEventListener("scroll", handleScroll);

    // Run once on mount if we're already at the bottom
    if (el.scrollTop === 0) {
      loadMore();
    }

    return () => el.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return { containerRef };
};
