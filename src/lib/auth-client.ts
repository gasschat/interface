import { createAuthClient } from "better-auth/react";
import { api } from "./baseUrl";

export const authClient = createAuthClient({
  baseURL: `${api}/api/auth`, // adjust if your backend runs on a different port or path
});

export const { useSession, signIn, signOut } = authClient; 