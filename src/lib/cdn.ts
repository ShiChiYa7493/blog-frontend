export const CDN_ASSET_BASE = "https://img.shichiya.cn/static/blog"

export function cdnAsset(name: string): string {
	return `${CDN_ASSET_BASE}/${name}`
}
