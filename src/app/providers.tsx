"use client";

import { initializeAuth } from "@/hooks/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </Fragment>
  );
}
