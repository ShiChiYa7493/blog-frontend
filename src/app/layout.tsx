import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
	title: {
		default: "Weigh Anchor!",
		template: "%s | 优川七夜",
	},
	description: "今乗り越え 未来へと Weigh Anchor!",
	icons: {
		icon: [
			{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
		],
		apple: "/apple-touch-icon.png",
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
