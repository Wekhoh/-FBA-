import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components (browser-side).
 * Use for: signInWithOtp, onAuthStateChange listeners, signOut, and any
 * mutation that runs in the browser bundle.
 */
export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
}
