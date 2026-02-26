"use client";

import { signOut, useSession } from "next-auth/react";

export default function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    token: session?.accessToken ?? null,
    session,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    logout: () => signOut({ callbackUrl: "/" }),
  };
}

