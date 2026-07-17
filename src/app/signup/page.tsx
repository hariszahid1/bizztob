import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SignupForm } from "./SignupForm";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const initialRole =
    searchParams.role === "distributor" ? "DISTRIBUTOR" : "RETAILER";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex flex-col justify-between p-10 hero-bg">
        <Logo />
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 max-w-md">
            Join the Bizztob network today.
          </h2>
          <p className="mt-3 text-slate-600 max-w-md">
            Retailers get an easy ordering app. Distributors get a modern
            console.
          </p>
        </div>
        <div />
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Start managing orders in minutes.
          </p>

          <div className="mt-6">
            <SignupForm initialRole={initialRole} />
          </div>

          <div className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
