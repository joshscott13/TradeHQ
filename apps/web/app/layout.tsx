import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "TradeHQ — Income planner", description: "An explicit, dynamic income scenario calculator for multi-account prop traders." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
