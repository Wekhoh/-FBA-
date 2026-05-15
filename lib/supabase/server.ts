import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Next.js Server Components, Route Handlers, and Server Actions.
 * In Server Components the `setAll` write is best-effort: cookie mutations are
 * silently dropped when invoked from a render pass. Refresh happens in
 * `lib/supabase/middleware.ts::updateSession`, so reads are always safe.
 */
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch {
						// Server Component render context — set is a no-op here.
						// The middleware refreshes the session before any read.
					}
				},
			},
		},
	);
}
