"use client";

import { initializeAuth } from "@/stores/useAuthStore";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAuth();
  }, []);

  return <>{children}</>;
}
