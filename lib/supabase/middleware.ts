import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session for the incoming request and gates
 * access to the protected app shell.
 *
 * Public paths (no auth required):
 *   /login, /auth/* (PKCE callback), Next internals (handled by matcher).
 *
 * Per @supabase/ssr docs, this MUST be called from a Next.js middleware so the
 * session tokens are refreshed before any Server Component reads them.
 */
export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => {
						request.cookies.set(name, value);
					});
					supabaseResponse = NextResponse.next({ request });
					cookiesToSet.forEach(({ name, value, options }) => {
						supabaseResponse.cookies.set(name, value, options);
					});
				},
			},
		},
	);

	// IMPORTANT: do not run any code between createServerClient and supabase.auth.getUser().
	// A mistake here makes session refresh silently fail.
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const pathname = request.nextUrl.pathname;
	const isPublic =
		pathname.startsWith("/login") ||
		pathname.startsWith("/auth") ||
		pathname === "/"; // landing redirects handled in app code

	if (!user && !isPublic) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect_to", pathname);
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
