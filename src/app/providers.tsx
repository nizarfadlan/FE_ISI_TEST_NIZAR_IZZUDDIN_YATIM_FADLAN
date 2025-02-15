"use client";

import { initializeAuth } from "@/hooks/useAuthStore";
import { queryClient } from "@/lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleInitialize = async () => {
      try {
        if (isInitialized) return;
        await initializeAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
    };

    handleInitialize();
  }, [isInitialized]);

  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Fragment>
  );
}
