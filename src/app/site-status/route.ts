import { NextResponse } from "next/server"
import { collectStatus } from "@/lib/status"

export const dynamic = "force-dynamic"

/**
 * Lightweight status feed for the home page badge.
 * Full details (latency, versions) stay on /status.
 */
export async function GET() {
	const snapshot = await collectStatus()
	const body = {
		overall: snapshot.overall,
		checkedAt: snapshot.checkedAt,
		services: snapshot.services.map((service) => ({ id: service.id, name: service.name, state: service.state })),
	}
	return NextResponse.json(body, { headers: { "cache-control": "no-store" } })
}
