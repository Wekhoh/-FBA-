import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
	title: "选品快算 · FBA Margin",
};

export default function QuickCalcPage() {
	return (
		<div className="container mx-auto max-w-3xl p-6">
			<h1 className="text-3xl font-bold tracking-tight">选品快算</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				一次性输入产品参数，立即看 L0-L5 毛利率，不保存到我的产品库。
			</p>

			<Card className="mt-8 border-dashed">
				<CardHeader>
					<Badge variant="outline" className="w-fit">
						S3 待实现
					</Badge>
					<CardTitle className="mt-2">输入表单 + 实时重算</CardTitle>
					<CardDescription>
						14 节 60+ 字段折叠面板（A. 基本信息 → N. 税务），左 input / 右 KPI +
						L0-L5 瀑布图实时更新，输入 debounce 300ms。
					</CardDescription>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					当前 Sprint 1 仅完成项目骨架。下一步 (S2) 实现{" "}
					<code className="font-mono text-xs">lib/fba-calc.ts</code>{" "}
					计算引擎并以原 Excel 产品 1/2 作为黄金样本测试。
				</CardContent>
			</Card>
		</div>
	);
}
