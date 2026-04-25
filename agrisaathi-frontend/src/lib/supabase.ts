import { createClient } from '@supabase/supabase-js';

// Hardcoding keys for the hackathon to 100% bypass any Vercel Environment Variable issues.
// (These keys are public anyway per Supabase architecture).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mgeymrfamukbqhzufxnr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZXltcmZhbXVrYnFoenVmeG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDgwNjMsImV4cCI6MjA4ODE4NDA2M30.8DgvFb7kqDqNciT1WletoxILwoQjO2a9mtFFMvSj-28';

let supabase: any;

try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    });
} catch (error) {
    console.error('Supabase initialization failed:', error);
    // Create a mock client that won't crash the app
    supabase = {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
            signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
            signInWithOAuth: async () => ({ error: new Error('Supabase not configured') }),
            signInWithOtp: async () => ({ error: new Error('Supabase not configured') }),
            verifyOtp: async () => ({ error: new Error('Supabase not configured') }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({ data: null, error: new Error('Supabase not configured') }),
                }),
            }),
        }),
    };
}

export { supabase };