import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="flex h-14 items-center justify-between border-b px-6">
				<nav className="flex items-center gap-2">
					<Link
						href="/dashboard"
						className="font-mono text-sm font-semibold tracking-tight"
					>
						⚡ FBA Margin
					</Link>
					<Separator orientation="vertical" className="h-5" />
					<Link href="/dashboard">
						<Button variant="ghost" size="sm">
							我的产品
						</Button>
					</Link>
					<Link href="/quick-calc">
						<Button variant="ghost" size="sm">
							选品快算
						</Button>
					</Link>
					<Link href="/members">
						<Button variant="ghost" size="sm">
							成员管理
						</Button>
					</Link>
				</nav>
				<div className="flex items-center gap-3 text-xs text-muted-foreground">
					<span>{user.email}</span>
					<form action="/auth/signout" method="post">
						<Button variant="ghost" size="sm" type="submit">
							退出
						</Button>
					</form>
				</div>
			</header>
			<main className="flex-1">{children}</main>
		</div>
	);
}
