import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { CDN_ASSET_BASE } from "@/lib/cdn"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
	title: {
		default: "Weigh Anchor!",
		template: "%s | 优川七夜",
	},
	// description: "今乗り越え 未来へと Weigh Anchor!",
	description: "跨越现今 前往未来 Weigh Anchor!",
	icons: {
		icon: [
			{ url: `${CDN_ASSET_BASE}/favicon-32.png`, sizes: "32x32", type: "image/png" },
			{ url: `${CDN_ASSET_BASE}/favicon-16.png`, sizes: "16x16", type: "image/png" },
		],
		apple: `${CDN_ASSET_BASE}/apple-touch-icon.png`,
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="zh-CN" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
