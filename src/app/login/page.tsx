import Link from "next/link";
import { MarketTopNav } from "@/components/MarketTopNav";
import { LoginForm } from "./LoginForm";
import { DeliveryIllustration } from "@/components/DeliveryIllustration";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <MarketTopNav showAuthLinks />

      <main className="max-w-[1200px] mx-auto px-4 lg:px-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <DeliveryIllustration />
          </div>

          <div className="order-1 lg:order-2">
            <div className="grad-border p-8 lg:p-10 bg-white shadow-soft max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-center text-slate-900">
                Login
              </h1>
              <p className="text-center text-slate-500 mt-1">
                Welcome onboard with us!
              </p>
              <div className="mt-6">
                <LoginForm nextUrl={searchParams.next} />
              </div>
              <div className="mt-6 text-sm text-slate-600 text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-brand-600 font-semibold hover:underline"
                >
                  Register
                </Link>
              </div>
            </div>
            <div className="mt-6 max-w-md mx-auto card p-4 text-sm">
              <p className="font-semibold text-slate-700 mb-2">
                Demo accounts (seeded)
              </p>
              <ul className="text-slate-600 space-y-0.5">
                <li>Admin: admin@bizztob.com / admin123</li>
                <li>Distributor: distributor@bizztob.com / dist123</li>
                <li>Retailer: retailer@bizztob.com / retail123</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
