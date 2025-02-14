"use client";

import { initializeAuth } from "@/hooks/useAuthStore";
import { Fragment, useEffect } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Fragment>
      {children}
      <Toaster />
    </Fragment>
  );
}
