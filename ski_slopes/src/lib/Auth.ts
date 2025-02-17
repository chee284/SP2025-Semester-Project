// src/lib/Auth.ts
import { auth, provider, signInWithPopup, signOut } from "./firebase";
import { User } from "firebase/auth";

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google login failed:", error);
    return null;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
}