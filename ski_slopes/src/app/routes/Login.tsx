// src/components/Login.tsx
import { useState } from "react";
import { loginWithGoogle, logout } from "@/lib/Auth";
import { User } from "firebase/auth";

export default function Login() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async () => {
    const loggedInUser = await loginWithGoogle();
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="flex flex-col items-center space-y-4 p-6 bg-gray-100 rounded-xl shadow-md mt-40">
        {user ? (
          <>
            <img src={user.photoURL || ""} alt="User Avatar" className="w-16 h-16 rounded-full" />
            <p>Welcome, {user.displayName}!</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login with Google
          </button>
        )}
      </div>
    </div>
  );
}