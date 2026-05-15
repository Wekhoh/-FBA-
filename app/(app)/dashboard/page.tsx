import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
	title: "我的产品 · FBA Margin",
};

export default function DashboardPage() {
	// TODO(S2): replace with real Supabase query: from('products').select('*, product_params(*)')
	const products: never[] = [];

	return (
		<div className="container mx-auto max-w-7xl p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">我的产品</h1>
					<p className="text-sm text-muted-foreground">
						公司全部 FBA 产品的毛利率监控看板（共享工作空间）
					</p>
				</div>
				<Link href="/quick-calc">
					<Button>+ 新建产品 / 选品估算</Button>
				</Link>
			</div>

			<div className="mt-8">
				{products.length === 0 ? (
					<Card className="border-dashed">
						<CardHeader>
							<CardTitle>还没有产品</CardTitle>
							<CardDescription>
								去「选品快算」填一份产品参数 → 点保存到我的产品 → 这里就会出现。
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-4 text-sm">
								<div className="flex items-center gap-2">
									<Badge variant="secondary">S1 ✓</Badge>
									<span>项目骨架 + Supabase Auth + Dashboard 骨架</span>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground">
									<Badge variant="outline">S2</Badge>
									<span>
										<code className="font-mono text-xs">lib/fba-calc.ts</code>{" "}
										计算引擎 + 黄金样本测试
									</span>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground">
									<Badge variant="outline">S3</Badge>
									<span>InputAccordion 14 节 + 实时重算 + KPIBar</span>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground">
									<Badge variant="outline">S4</Badge>
									<span>WaterfallChart L0-L5 + Scenario Strip</span>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground">
									<Badge variant="outline">S5</Badge>
									<span>Sensitivity Heatmap 2D + Storage Helper</span>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground">
									<Badge variant="outline">S6</Badge>
									<span>多人测试 + Vercel 上线</span>
								</div>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{/* S2+ product cards */}
					</div>
				)}
			</div>
		</div>
	);
}
