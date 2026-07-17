import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex flex-col justify-between p-10 hero-bg">
        <Logo />
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 max-w-md">
            Digitize orders. Simplify ledgers. Grow faster.
          </h2>
          <p className="mt-3 text-slate-600 max-w-md">
            Bizztob is a modern B2B ordering platform for retailers and
            distributors.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Demo accounts on the sign-in page →
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to your Bizztob account.
          </p>

          <div className="mt-6">
            <LoginForm nextUrl={searchParams.next} />
          </div>

          <div className="mt-6 text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-700 font-medium">
              Create one
            </Link>
          </div>

          <div className="mt-8 card p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Demo accounts (seeded)
            </p>
            <ul className="mt-2 text-sm text-slate-700 space-y-1">
              <li>
                <b>Admin:</b> admin@bizztob.com / admin123
              </li>
              <li>
                <b>Distributor:</b> distributor@bizztob.com / dist123
              </li>
              <li>
                <b>Retailer:</b> retailer@bizztob.com / retail123
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
