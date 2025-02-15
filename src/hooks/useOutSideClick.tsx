"use client";

import { useEffect, useCallback } from "react";

export function useOutSideClick(
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void,
  isCollapsed: boolean,
  onlyMobile: boolean,
) {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (onlyMobile && window.innerWidth > 1024) return;
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        isCollapsed
      ) {
        console.log("click outside");
        callback();
      }
    },
    [ref, callback, isCollapsed, onlyMobile],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick, onlyMobile]);
}
