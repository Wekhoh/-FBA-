import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase email magic-link callback (PKCE flow).
 *
 * The email link looks like:
 *   {SITE_URL}/auth/callback?code=<pkce-code>&next=/dashboard
 *
 * We exchange the code for a session (sets sb-*-auth-token cookies via the
 * cookie adapter in lib/supabase/server.ts), then redirect to `next` or
 * `/dashboard` by default.
 */
export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/dashboard";

	if (!code) {
		return NextResponse.redirect(`${origin}/login?error=missing_code`);
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.exchangeCodeForSession(code);

	if (error) {
		return NextResponse.redirect(
			`${origin}/login?error=${encodeURIComponent(error.message)}`,
		);
	}

	// Safety: only redirect to in-app relative paths.
	const safeNext = next.startsWith("/") ? next : "/dashboard";
	return NextResponse.redirect(`${origin}${safeNext}`);
}
