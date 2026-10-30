import { NextResponse } from "next/server"
import { collectStatus, type ServiceState } from "@/lib/status"
import { appendSample, HISTORY_SERVICE_IDS } from "@/lib/status-history"

export const dynamic = "force-dynamic"

/**
 * Collector entrypoint, protected by a shared bearer token.
 *
 * A source-address check is not usable here: Next.js fills in
 * X-Forwarded-For from the socket, so loopback and proxied requests look the
 * same. The token lives in the server .env and is only used by the cron job.
 */
export async function GET(request: Request) {
	const token = process.env.STATUS_RECORD_TOKEN
	if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
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