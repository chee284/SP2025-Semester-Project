// src/components/Login.tsx
<<<<<<< Updated upstream
import { useState, useEffect } from "react";
import { loginWithGoogle, logout } from "@/lib/Auth";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js"; 
=======
import { useAuthStore } from "@/store/authStore";
>>>>>>> Stashed changes

export default function Login() {
  const [user, setUser] = useState<User | null>(null);

  // getting user data
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user); 
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="flex flex-col items-center space-y-4 p-6 bg-gray-100 rounded-xl shadow-md mt-40">
        {user ? (
          <>
            <img
              src={user?.user_metadata?.avatar_url || ""}
              alt="User Avatar"
              className="w-16 h-16 rounded-full"
            />
            <p>Welcome, {user?.user_metadata?.full_name}!</p>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login with Google
          </button>
        )}
      </div>
    </div>
  );
}
