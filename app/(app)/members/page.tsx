import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
	title: "成员管理 · FBA Margin",
};

export default function MembersPage() {
	return (
		<div className="container mx-auto max-w-3xl p-6">
			<h1 className="text-3xl font-bold tracking-tight">成员管理</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				邀请同事加入共享工作空间。所有成员看到公司全部产品（基于 Supabase RLS
				authenticated 全员读写）。
			</p>

			<Card className="mt-8 border-dashed">
				<CardHeader>
					<Badge variant="outline" className="w-fit">
						S6 待实现
					</Badge>
					<CardTitle className="mt-2">邮箱邀请 + 成员列表 + 撤销访问</CardTitle>
					<CardDescription>
						主人输入同事邮箱 → Server Action 调{" "}
						<code className="font-mono text-xs">
							supabase.auth.admin.inviteUserByEmail()
						</code>{" "}
						→ 同事点 magic link → 自动登录看到全部产品。撤销访问通过删除{" "}
						<code className="font-mono text-xs">auth.users</code> 记录。
					</CardDescription>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					需要在 Supabase Studio 配置 SMTP 才能发邀请邮件；或用 Supabase
					默认邮件服务（每月 100 封）。
				</CardContent>
			</Card>
		</div>
	);
}
