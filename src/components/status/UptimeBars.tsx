"use client"

import { useState } from "react"
import type { ServiceState } from "@/lib/status"

export type UptimeDay = { date: string; state: ServiceState | "none" }

const TICK_CLASS: Record<UptimeDay["state"], string> = {
	up: "bg-emerald-500/85",
	degraded: "bg-amber-400/90",
	down: "bg-rose-500/90",
	unknown: "bg-muted-foreground/25",
	none: "bg-muted-foreground/10",
}

const STATE_LABEL: Record<UptimeDay["state"], string> = {
	up: "正常",
	degraded: "降级",
	down: "不可用",
	unknown: "未知",
	none: "无数据",
}

function formatDate(date: string): string {
	const [year, month, day] = date.split("-")
	return `${year}/${month}/${day}`
}

/** One tick per day, with a hover/tap tooltip that names the date and state. */
export function UptimeBars({ days, label }: { days: UptimeDay[]; label: string }) {
	const [active, setActive] = useState<number | null>(null)
	const cell = active === null ? null : days[active]

	return (
		<div className="relative">
			<div
				className="mt-2 flex gap-[3px] h-6"
				role="img"
				aria-label={`${label} 最近 ${days.length} 天可用性`}
				onMouseLeave={() => setActive(null)}
			>
				{days.map((day, index) => (
					<span
						key={day.date}
						title={`${formatDate(day.date)} · ${STATE_LABEL[day.state]}`}
						onMouseEnter={() => setActive(index)}
						onClick={() => setActive(index)}
						className={`flex-1 rounded-[2px] cursor-default transition-shadow ${TICK_CLASS[day.state]} ${
							active === index ? "ring-1 ring-foreground/50 dark:ring-white/60" : ""
						}`}
					/>
				))}
			</div>

			{cell && (
				<div
					data-uptime-tooltip=""
					className="pointer-events-none absolute -top-9 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-popover-foreground shadow-md"
					style={{ left: `clamp(56px, ${((active! + 0.5) / days.length) * 100}%, calc(100% - 56px))` }}
				>
					<span className="tabular-nums">{formatDate(cell.date)}</span>
					<span className="mx-1.5 text-muted-foreground">·</span>
					<span>{STATE_LABEL[cell.state]}</span>
				</div>
			)}
		</div>
	)
}
