import { MarketTopNav } from "@/components/MarketTopNav";

export default function RetailerMarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <MarketTopNav />
      <div>{children}</div>
    </div>
  );
}
