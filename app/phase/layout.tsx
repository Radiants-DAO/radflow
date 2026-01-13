import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phase - Institutional Staking & Tax Infrastructure for Solana",
  description: "The leading institutional staking and tax compliance infrastructure for Solana. Native & liquid staking, delegation services, and crypto tax reporting.",
};

export default function PhaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface-primary font-outfit text-content-primary">
      {children}
    </div>
  );
}
