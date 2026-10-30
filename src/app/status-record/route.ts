import { NextResponse } from "next/server"
import { collectStatus, type ServiceState } from "@/lib/status"
import { appendSample, HISTORY_SERVICE_IDS } from "@/lib/status-history"

export const dynamic = "force-dynamic"

/**
 * Loopback-only collector entrypoint.
 *
 * nginx always adds X-Forwarded-For, so a request without it comes straight
 * from the host (the cron job). A shared token is accepted as an alternative
 * for running the collector from another machine.
 */
export async function GET(request: Request) {
	const proxied = request.headers.get("x-forwarded-for")
	const token = process.env.STATUS_RECORD_TOKEN
	const authorized = !proxied || (token ? request.headers.get("authorization") === `Bearer ${token}` : false)
	if (!authorized) {
		return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 })
	}

	const snapshot = await collectStatus()
	const states = {} as Record<(typeof HISTORY_SERVICE_IDS)[number], ServiceState>
	for (const service of snapshot.services) {
		if ((HISTORY_SERVICE_IDS as readonly string[]).includes(service.id)) {
			states[service.id as (typeof HISTORY_SERVICE_IDS)[number]] = service.state
		}
	}
	await appendSample(states)

	return NextResponse.json({ ok: true, recordedAt: snapshot.checkedAt, states }, { headers: { "cache-control": "no-store" } })
}
