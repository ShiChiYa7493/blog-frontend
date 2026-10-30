import type { Metadata } from "next"
import { SakuraCanvas } from "@/components/home/SakuraCanvas"
import { ParallaxBackground } from "@/components/home/ParallaxBackground"
import { HomeCard } from "@/components/home/HomeCard"
import { getChangelog, getLatestEntry, formatEntryDate } from "@/lib/changelog"

export const metadata: Metadata = {
	title: "Weigh Anchor!",
	// description: "今乗り越え 未来へと Weigh Anchor! — 跨越现今，前往未来，起锚吧！",
	description:
		"优川七夜的个人站点：Warframe 配卡计算器 ARSENAL、QQ 机器人咪娅，以及自建服务的更新记录与运行状态。",
	alternates: { canonical: "https://shichiya.cn" },
}

export default function HomePage() {
	const latest = getLatestEntry(getChangelog())

	return (
		<div className="relative min-h-screen flex items-end justify-center pb-12 md:pb-16 overflow-hidden">
			<ParallaxBackground />
			<SakuraCanvas />
			<HomeCard
				latest={
					latest
						? {
								product: latest.product.name,
								date: formatEntryDate(latest.entry.date),
								title: latest.entry.title,
							}
						: null
				}
			/>
			<div className="absolute bottom-2 left-0 right-0 z-20 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 px-4 text-[11px] text-white/60">
				<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
					蜀ICP备2026017856号
				</a>
				<span>·</span>
				<a
					href="https://icp.gov.moe/?keyword=20267493"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-white transition-colors"
				>
					萌ICP备20267493号
				</a>
			</div>
		</div>
	)
}