"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type SidebarContextType = {
  toggleSidebar: boolean;
  setToggleSidebar: Dispatch<SetStateAction<boolean>>;
  sidebarWidth?: number;
};

export const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType,
);

export default function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);

  useEffect(() => {
    setSidebarWidth(toggleSidebar ? 260 : 0);
    window.addEventListener("resize", () => {
      if (toggleSidebar && window.innerWidth >= 1536) {
        setToggleSidebar(false);
      }
    });

    return () => {
      window.removeEventListener("resize", () => {
        if (toggleSidebar && window.innerWidth >= 1536) {
          setToggleSidebar(false);
        }
      });
    };
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider
      value={{
        toggleSidebar,
        setToggleSidebar,
        sidebarWidth,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
