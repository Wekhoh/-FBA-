"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirect_to") ?? "/dashboard";

	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);

		const supabase = createClient();
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
			},
		});

		setLoading(false);

		if (error) {
			toast.error("登录链接发送失败", { description: error.message });
			return;
		}

		setSent(true);
		toast.success("登录链接已发送", {
			description: "请查收邮箱并点击链接完成登录。",
		});
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">FBA Margin Calculator</CardTitle>
				<CardDescription>
					输入邮箱，我们会发送一次性登录链接（无需密码）。
				</CardDescription>
			</CardHeader>
			<CardContent>
				{sent ? (
					<div className="space-y-2 text-sm">
						<p>
							已发送登录链接到 <strong>{email}</strong>
						</p>
						<p className="text-muted-foreground">
							请打开邮箱点击 Magic Link 完成登录。链接有效期 1 小时。
						</p>
						<button
							type="button"
							onClick={() => setSent(false)}
							className="text-primary underline-offset-4 hover:underline"
						>
							用不同邮箱再次发送
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">邮箱</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
								autoComplete="email"
								autoFocus
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={loading || !email}
						>
							{loading ? "发送中…" : "发送登录链接"}
						</Button>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
