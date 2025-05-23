import { create } from "zustand";
import { createClient, User } from "@supabase/supabase-js";

// Helper function to get the correct base URL
const getBaseUrl = () => {
    const hostname = window.location.hostname;
    return hostname === '127.0.0.1' 
        ? "http://127.0.0.1:54321"
        : "http://localhost:54321";
};

// Helper function to get the correct callback URL
const getCallbackUrl = () => {
    const hostname = window.location.hostname;
    return hostname === '127.0.0.1'
        ? "http://127.0.0.1:5173/auth/callback"
        : "http://localhost:5173/auth/callback";
};

const supabase = createClient(
    getBaseUrl(),
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
);

// Initialize session on page load
const initSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        useAuthStore.setState({ 
            session: session, 
            user: session.user, 
            isAuthenticated: true, 
            isLoading: false 
        });
    } else {
        useAuthStore.setState({ 
            session: null, 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
        });
    }
};

// Call initSession immediately
initSession();

supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
        console.log("signed in");
        useAuthStore.setState({ 
            session: session, 
            user: session?.user, 
            isAuthenticated: true, 
            isLoading: false 
        });
    } else if (event === "SIGNED_OUT") {
        console.log("signed out");
        useAuthStore.setState({ 
            session: null, 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
        });
    }
});

type Auth = {
    session: any | null;
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    getUser: () => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithGithub: () => Promise<void>;
}

export const useAuthStore = create<Auth>((set) => ({
    session: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,

    getUser: async () => {
        try {
            set({ isLoading: true });
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                set({ 
                    session: session,
                    user: session.user,
                    isAuthenticated: true
                });
            } else {
                set({ 
                    session: null,
                    user: null,
                    isAuthenticated: false
                });
            }
        } catch (error) {
            console.error("get user failed:", error);
            set({ 
                session: null,
                user: null,
                isAuthenticated: false
            });
        } finally {
            set({ isLoading: false });
        }
    },

    signInWithGoogle: async () => {
        try {
            set({ isLoading: true });
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { 
                    redirectTo: getCallbackUrl(),
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                },
            });
            if (error) throw error;
            window.location.href = data.url;
        } catch (error) {
            console.error("signin with google failed:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    signInWithGithub: async () => {
        try {
            set({ isLoading: true });
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: { 
                    redirectTo: getCallbackUrl(),
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                },
            });
            if (error) throw error;
            window.location.href = data.url;
        } catch (error) {
            console.error("signin with github failed:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            // Update state first
            set({ session: null, user: null, isLoading: false, isAuthenticated: false });
            // Then navigate to home
            window.location.href = "/";
        } catch (error) {
            console.error("signout failed:", error);
            set({ session: null, user: null, isLoading: false, isAuthenticated: false });
        }
    },
}));