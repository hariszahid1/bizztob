import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  CheckCircle2,
  ClipboardList,
  ScanLine,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen hero-bg">
      {/* Nav */}
      <header className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-700">
          <a href="#features" className="hover:text-brand-700">
            Features
          </a>
          <a href="#ai" className="hover:text-brand-700">
            AI
          </a>
          <a href="#how" className="hover:text-brand-700">
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-10 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge-blue">
              <Sparkles className="h-3.5 w-3.5" /> B2B Ordering, Reimagined
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900">
              Connect retail shops with their distributors — in one place.
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl">
              Bizztob replaces phone calls, WhatsApp orders, and messy ledgers.
              Retailers order digitally, distributors deliver on time, and
              everyone stays in sync.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup?role=retailer" className="btn-primary">
                I&apos;m a Retailer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/signup?role=distributor" className="btn-secondary">
                I&apos;m a Distributor
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-600" /> Free for
                MVP
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-600" /> Mobile
                friendly
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-600" /> AI-ready
              </div>
            </div>
          </div>

          {/* Hero Illustration Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-5">
                <div className="flex items-center gap-2 text-brand-700 font-medium">
                  <Store className="h-4 w-4" /> Retailer
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Order in 30 seconds
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Pepsi 250ml x 20</span>
                    <span className="text-slate-500">Rs 6,000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Lays Salted</span>
                    <span className="text-slate-500">Rs 2,400</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Nestlé Milk</span>
                    <span className="text-slate-500">Rs 4,200</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total</span>
                  <span className="font-semibold">Rs 12,600</span>
                </div>
              </div>

              <div className="card p-5 mt-8">
                <div className="flex items-center gap-2 text-brand-700 font-medium">
                  <Truck className="h-4 w-4" /> Distributor
                </div>
                <p className="text-xs text-slate-500 mt-1">Today&apos;s orders</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>ORD-241001</span>
                    <span className="badge-amber">Pending</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ORD-241002</span>
                    <span className="badge-blue">Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ORD-241003</span>
                    <span className="badge-green">Delivered</span>
                  </div>
                </div>
              </div>

              <div className="card p-5 col-span-2">
                <div className="flex items-center gap-2 text-brand-700 font-medium">
                  <Bot className="h-4 w-4" /> AI Assistant
                </div>
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  &ldquo;You usually buy 20 crates of Pepsi every 10 days.
                  Reorder now?&rdquo;
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="btn-primary">Reorder</button>
                  <button className="btn-secondary">Not now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-white border-y border-slate-200 py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900">
            Everything you need to run B2B ordering
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Retailer app, distributor console, deliveries, and clean ledgers —
            in one platform.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <Feature
              icon={<Store className="h-5 w-5" />}
              title="Retailer App"
              desc="Browse catalogs, place orders, and track balance from your phone."
            />
            <Feature
              icon={<ClipboardList className="h-5 w-5" />}
              title="Distributor Console"
              desc="Manage products, confirm orders, and handle deliveries in one place."
            />
            <Feature
              icon={<Truck className="h-5 w-5" />}
              title="Deliveries"
              desc="Assign drivers, schedule dispatch, and mark deliveries as complete."
            />
            <Feature
              icon={<Boxes className="h-5 w-5" />}
              title="Catalog & Stock"
              desc="Keep prices and stock updated. Retailers see what's really in stock."
            />
            <Feature
              icon={<BarChart3 className="h-5 w-5" />}
              title="Ledgers"
              desc="Automatic invoices and payments — no more paper khata."
            />
            <Feature
              icon={<Sparkles className="h-5 w-5" />}
              title="Admin Console"
              desc="Manage distributors, retailers, and see platform metrics."
            />
          </div>
        </div>
      </section>

      {/* AI */}
      <section id="ai" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge-green">
              <Sparkles className="h-3.5 w-3.5" /> AI Features (Planned)
            </span>
            <h2 className="mt-3 text-2xl lg:text-3xl font-semibold text-slate-900">
              Smart selling with AI, built in.
            </h2>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li className="flex gap-3">
                <Sparkles className="h-5 w-5 text-brand-600 mt-0.5" />
                <span>
                  <strong>Smart Reorder Suggestions</strong> — nudge retailers to
                  reorder based on their history.
                </span>
              </li>
              <li className="flex gap-3">
                <BarChart3 className="h-5 w-5 text-brand-600 mt-0.5" />
                <span>
                  <strong>Demand Forecasting</strong> — distributors see which
                  SKUs will spike next week.
                </span>
              </li>
              <li className="flex gap-3">
                <ScanLine className="h-5 w-5 text-brand-600 mt-0.5" />
                <span>
                  <strong>Invoice Scanning (OCR)</strong> — snap an invoice and
                  we auto-extract items and totals.
                </span>
              </li>
              <li className="flex gap-3">
                <Bot className="h-5 w-5 text-brand-600 mt-0.5" />
                <span>
                  <strong>Chatbot Assistant</strong> — &ldquo;Show my ledger
                  balance&rdquo; or &ldquo;How many orders pending?&rdquo;
                </span>
              </li>
            </ul>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <Bot className="h-4 w-4 text-brand-600" /> Bizztob Assistant
            </div>
            <div className="mt-4 space-y-3">
              <ChatBubble self>How many orders are pending today?</ChatBubble>
              <ChatBubble>
                You have <strong>4 pending orders</strong> worth Rs 48,200.
                Would you like me to auto-confirm the first two?
              </ChatBubble>
              <ChatBubble self>Show ledger balance for Al-Karam Store.</ChatBubble>
              <ChatBubble>
                Al-Karam Store owes <strong>Rs 12,600</strong>. Last payment: 4
                days ago.
              </ChatBubble>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Step
              n={1}
              title="Distributor lists products"
              desc="Add products, prices, and stock in minutes."
            />
            <Step
              n={2}
              title="Retailer places order"
              desc="Browse the catalog and check out — no phone calls."
            />
            <Step
              n={3}
              title="Deliver & settle ledger"
              desc="Confirm delivery, auto-invoice, and record payments."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="card p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                Ready to digitize your distribution?
              </h3>
              <p className="text-slate-600 mt-2">
                Set up in minutes. No credit card required.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/signup" className="btn-primary">
                Create account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Logo compact />
            <span>© {new Date().getFullYear()} Bizztob</span>
          </div>
          <div>Made for local retailers & distributors.</div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="card p-5">
      <div className="h-10 w-10 rounded-lg bg-brand-50 text-brand-700 grid place-items-center">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="card p-6">
      <div className="h-8 w-8 rounded-full bg-brand-600 text-white grid place-items-center font-semibold">
        {n}
      </div>
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function ChatBubble({
  children,
  self,
}: {
  children: React.ReactNode;
  self?: boolean;
}) {
  return (
    <div className={`flex ${self ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
          self
            ? "bg-brand-600 text-white rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
