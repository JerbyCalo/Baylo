"use client";

import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRequireAuth = () => {
  const { user, loading, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return { user, loading, userProfile };
};
