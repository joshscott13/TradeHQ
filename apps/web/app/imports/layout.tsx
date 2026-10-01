import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TradeHQ — Imports",
  description: "Review synthetic trading records in the TradeHQ CSV format before import.",
};

export default function ImportsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
