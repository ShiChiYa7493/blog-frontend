import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Weigh Anchor!",
	description: "今乗り越え 未来へと Weigh Anchor! — 跨越现今，前往未来，起锚吧！",
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
