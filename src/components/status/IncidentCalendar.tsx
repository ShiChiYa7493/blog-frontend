"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type Incident = {
	date: string
	service: string
	level: "major" | "minor" | "info"
	status: string
	title: string
	summary: string
}

function monthOf(date: string): string {
	return date.slice(0, 7)
}

function currentMonth(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit" }).format(new Date())
}

function shiftMonth(ym: string, delta: number): string {
	const [year, month] = ym.split("-").map(Number)
	const date = new Date(Date.UTC(year, month - 1 + delta, 1))
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
}

function monthLabel(ym: string): string {
	const [year, month] = ym.split("-").map(Number)
	return `${year}年${month}月`
}

function buildCalendar(ym: string): (string | null)[] {
	const [year, month] = ym.split("-").map(Number)
	const first = new Date(Date.UTC(year, month - 1, 1))
	const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
	const leading = (first.getUTCDay() + 6) % 7 // Monday-first grid
	const cells: (string | null)[] = Array.from({ length: leading }, () => null)
	for (let day = 1; day <= daysInMonth; day += 1) {
		cells.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
	}
	while (cells.length % 7 !== 0) cells.push(null)
	return cells
}

function statusLabel(value: string): string {
	return value === "resolved" ? "已解决" : value === "ongoing" ? "处理中" : value
}

/**
 * Month switching is local state on purpose: navigating with a Link re-renders
 * the route and jumps the page back to the top.
 */
export function IncidentCalendar({ incidents }: { incidents: Incident[] }) {
	const [month, setMonth] = useState(currentMonth())
	const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
	const cells = buildCalendar(month)
	const monthIncidents = incidents.filter((incident) => monthOf(incident.date) === month)
	const byDate = new Map(monthIncidents.map((incident) => [incident.date, incident]))

	return (
		<>
			<header className="flex items-center justify-between px-5 py-3 border-b border-border/60">
				<h2 className="text-sm font-semibold">事件日历</h2>
				<div className="flex items-center gap-1 text-xs text-muted-foreground">
					<button
						type="button"
						onClick={() => setMonth((value) => shiftMonth(value, -1))}
						className="p-1 rounded hover:bg-muted transition-colors"
						aria-label="上个月"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<span className="tabular-nums mx-1 w-[86px] text-center">{monthLabel(month)}</span>
					<button
						type="button"
						onClick={() => setMonth((value) => shiftMonth(value, 1))}
						className="p-1 rounded hover:bg-muted transition-colors"
						aria-label="下个月"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</header>

			<div className="px-5 py-4">
				<div className="grid grid-cols-7 text-center text-[11px] text-muted-foreground mb-2">
					{["一", "二", "三", "四", "五", "六", "日"].map((day) => (
						<span key={day}>{day}</span>
					))}
				</div>
				<div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
					{cells.map((date, index) => {
						if (!date) return <span key={`blank-${index}`} />
						const incident = byDate.get(date)
						const isToday = date === today
						return (
							<span key={date} className="flex items-center justify-center">
								<span
									title={incident ? incident.title : undefined}
									className={[
										"flex h-7 w-7 items-center justify-center rounded-full tabular-nums transition-colors",
										incident
											? incident.level === "major"
												? "border border-rose-500/50 text-rose-600 dark:text-rose-400"
												: "border border-amber-500/50 text-amber-600 dark:text-amber-400"
											: "text-muted-foreground",
										isToday && !incident ? "bg-primary/10 text-foreground font-medium" : "",
									].join(" ")}
								>
									{Number(date.slice(8))}
								</span>
							</span>
						)
					})}
				</div>

				<div className="mt-4 space-y-2">
					{monthIncidents.length === 0 ? (
						<p className="text-xs text-muted-foreground">本月无已记录的事件。</p>
					) : (
						monthIncidents.map((incident) => (
							<div key={`${incident.date}-${incident.title}`} className="rounded-lg border border-border/60 px-3 py-2">
								<div className="flex items-center gap-2 text-xs">
									<span className={`h-1.5 w-1.5 rounded-full ${incident.level === "major" ? "bg-rose-500" : "bg-amber-500"}`} />
									<span className="tabular-nums text-muted-foreground">{incident.date}</span>
									<span className="text-[11px] text-muted-foreground">· {statusLabel(incident.status)}</span>
								</div>
								<p className="text-sm mt-1">{incident.title}</p>
								<p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{incident.summary}</p>
							</div>
						))
					)}
				</div>
			</div>
		</>
	)
}
