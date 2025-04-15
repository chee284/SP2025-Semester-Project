import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";

// handles authentication and directes user to homepage
export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        async function handleAuthRedirect() {
            try {
                console.log("Starting auth callback...");
                console.log("Current URL:", window.location.href);
                
                const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
                
                if (error) {
                    console.error("Auth callback error:", error);
                    console.error("Error details:", {
                        message: error.message,
                        status: error.status,
                        name: error.name
                    });
                } else {
                    console.log("Auth successful:", data);
                    console.log("Session:", data.session);
                    console.log("User:", data.user);
                }

                navigate("/login"); 
            } catch (err) {
                console.error("Unexpected error in auth callback:", err);
            }
        }

        handleAuthRedirect();
    }, [navigate]);

    return <p>Processing login...</p>;
}