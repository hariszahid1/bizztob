import Link from "next/link";
import { MarketTopNav } from "@/components/MarketTopNav";
import { SignupForm } from "./SignupForm";
import { User as UserIcon } from "lucide-react";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const initialRole =
    searchParams.role === "distributor" ? "DISTRIBUTOR" : "RETAILER";

  return (
    <div className="min-h-screen bg-canvas">
      <MarketTopNav showAuthLinks />

      <main className="max-w-[1200px] mx-auto px-4 lg:px-10 py-8 lg:py-14">
        <div className="grad-border p-8 lg:p-10 bg-white shadow-soft max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-slate-900">
            Register
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-brand-100 grid place-items-center border-2 border-brand-200">
              <UserIcon className="h-8 w-8 text-brand-600" />
            </div>
          </div>
          <div className="mt-6">
            <SignupForm initialRole={initialRole} />
          </div>
          <div className="mt-6 text-sm text-slate-500 text-center">
            Already have account?{" "}
            <Link
              href="/login"
              className="text-brand-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
