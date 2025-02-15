"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useMedia from "./useMedia";

type SidebarContextType = {
  isCollapsed: boolean;
  toggleSidebar: (state: boolean) => void;
  isMobile: boolean;
};

export const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType,
);

export default function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const initialRenderDone = useRef(false);

  const isMobile = useMedia("(max-width: 1024px)");

  const toggleSidebar = useCallback((state: boolean) => {
    console.log("toggleSidebar");
    setIsCollapsed(state);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        console.log("useEffect handleResize");
        setIsCollapsed(false);
      }
    };

    if (!initialRenderDone.current) {
      handleResize();
      initialRenderDone.current = true;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed, initialRenderDone]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
