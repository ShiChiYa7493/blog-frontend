import raw from "@/content/changelog.json"

export type ChangelogEntryType = "新增" | "改进" | "修复" | "数据"

export type ChangelogEntry = {
	date: string
	type: ChangelogEntryType
	title: string
	items?: string[]
}

export type ChangelogProduct = {
	id: string
	name: string
	summary: string
	badges?: string[]
	home?: string
	entries: ChangelogEntry[]
}

export type ChangelogFile = {
	updatedAt: string
	products: ChangelogProduct[]
}

function byDateDesc(a: ChangelogEntry, b: ChangelogEntry) {
	return a.date < b.date ? 1 : a.date > b.date ? -1 : 0
}

/** Loads the changelog, normalising order so the newest entry is always first. */
export function getChangelog(): ChangelogFile {
	const file = raw as ChangelogFile
	return {
		updatedAt: file.updatedAt,
		products: file.products.map((product) => ({
			...product,
			entries: [...product.entries].sort(byDateDesc),
		})),
	}
}

export function getLatestEntry(file: ChangelogFile): { product: ChangelogProduct; entry: ChangelogEntry } | null {
	let latest: { product: ChangelogProduct; entry: ChangelogEntry } | null = null
	for (const product of file.products) {
		const entry = product.entries[0]
		if (!entry) continue
		if (!latest || entry.date > latest.entry.date) latest = { product, entry }
	}
	return latest
}

export function formatEntryDate(iso: string): string {
	const [year, month, day] = iso.split("-")
	if (!year || !month || !day) return iso
	return `${year}.${month}.${day}`
}
