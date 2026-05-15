import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
	title: "登录 · FBA Margin Calculator",
};

export default function LoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-4">
			<Suspense fallback={<Skeleton className="h-[280px] w-full max-w-md" />}>
				<LoginForm />
			</Suspense>
		</main>
	);
}
