// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

console.log("Initializing Supabase client...");
console.log("Supabase URL:", import.meta.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Key present:", !!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!import.meta.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
        }
    }
);

console.log("Supabase client initialized");

// Test database connection
export const testConnection = async () => {
    try {
        const { error } = await supabase
            .from('favorites')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Database connection test failed:', error);
            return false;
        }

        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
};

// Create favorites table
export const createFavoritesTable = async () => {
    const { error } = await supabase.rpc('create_table_if_not_exists', {
        table_sql: `
            CREATE TABLE IF NOT EXISTS favorites (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                user_id UUID NOT NULL,
                resort_name TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, resort_name)
            );

            -- Enable RLS
            ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Enable read for users" ON favorites
                FOR SELECT USING (auth.uid() = user_id);

            CREATE POLICY "Enable insert for users" ON favorites
                FOR INSERT WITH CHECK (auth.uid() = user_id);

            CREATE POLICY "Enable delete for users" ON favorites
                FOR DELETE USING (auth.uid() = user_id);

            -- Create indexes
            CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);
            CREATE INDEX IF NOT EXISTS favorites_resort_name_idx ON favorites(resort_name);
        `
    });

    if (error) {
        console.error('Error creating favorites table:', error);
        return false;
    }

    return true;
};

// Initialize connection on app start
testConnection().then(connected => {
    if (connected) {
        console.log('Successfully connected to Supabase database');
    } else {
        console.error('Failed to connect to Supabase database');
    }
});

// Function to initialize the favorites table
export const initializeFavoritesTable = async () => {
    const { error } = await supabase.rpc('create_favorites_table');
    if (error) {
        console.error('Error creating favorites table:', error);
    }
};

// Create stored procedure for table initialization
export const createStoredProcedure = async () => {
    const { error } = await supabase.rpc('create_stored_procedure', {
        sql: `
        CREATE OR REPLACE FUNCTION create_favorites_table()
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
            CREATE TABLE IF NOT EXISTS public.favorites (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID NOT NULL,
                resort_name TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, resort_name)
            );

            -- Set up Row Level Security (RLS)
            ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

            -- Create policies if they don't exist
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE tablename = 'favorites' AND policyname = 'Users can view their own favorites'
                ) THEN
                    CREATE POLICY "Users can view their own favorites"
                        ON public.favorites
                        FOR SELECT
                        USING (auth.uid() = user_id);
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE tablename = 'favorites' AND policyname = 'Users can insert their own favorites'
                ) THEN
                    CREATE POLICY "Users can insert their own favorites"
                        ON public.favorites
                        FOR INSERT
                        WITH CHECK (auth.uid() = user_id);
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE tablename = 'favorites' AND policyname = 'Users can delete their own favorites'
                ) THEN
                    CREATE POLICY "Users can delete their own favorites"
                        ON public.favorites
                        FOR DELETE
                        USING (auth.uid() = user_id);
                END IF;
            END $$;

            -- Create indexes if they don't exist
            CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
            CREATE INDEX IF NOT EXISTS favorites_resort_name_idx ON public.favorites(resort_name);

            -- Grant permissions
            GRANT ALL ON public.favorites TO authenticated;
            GRANT USAGE ON SCHEMA public TO anon, authenticated;
        END;
        $$;
        `
    });
    
    if (error) {
        console.error('Error creating stored procedure:', error);
    }
};

// Initialize the database
export const initializeDatabase = async () => {
    await createStoredProcedure();
    await initializeFavoritesTable();
};
