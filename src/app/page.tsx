import Link from "next/link";
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
import { MarketTopNav } from "@/components/MarketTopNav";
import { DeliveryIllustration } from "@/components/DeliveryIllustration";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <MarketTopNav showAuthLinks />

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-4 lg:px-10 pt-8 lg:pt-16 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> B2B Ordering, Reimagined
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Connect retail shops with their{" "}
              <span className="bg-clip-text text-transparent bg-brand-gradient">
                distributors
              </span>
              .
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl">
              Bizztob replaces phone calls, WhatsApp orders, and messy ledgers.
              Retailers order digitally, distributors deliver on time, and
              everyone stays in sync.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup?role=retailer" className="btn-primary h-11 px-6">
                I&apos;m a Retailer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/signup?role=distributor" className="btn-secondary h-11 px-6">
                I&apos;m a Distributor
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Free for MVP
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Mobile friendly
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> AI-ready
              </div>
            </div>
          </div>

          <div className="grad-border p-6 lg:p-8 bg-white shadow-soft">
            <DeliveryIllustration />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 lg:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">
            Everything you need to run B2B ordering
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Retailer app, distributor console, deliveries, and clean ledgers —
            in one platform.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <Feature icon={<Store className="h-5 w-5" />} title="Retailer App" desc="Browse catalogs, place orders, and track balance from your phone." />
            <Feature icon={<ClipboardList className="h-5 w-5" />} title="Distributor Console" desc="Manage products, confirm orders, and handle deliveries in one place." />
            <Feature icon={<Truck className="h-5 w-5" />} title="Deliveries" desc="Assign drivers, schedule dispatch, and mark deliveries as complete." />
            <Feature icon={<Boxes className="h-5 w-5" />} title="Catalog & Stock" desc="Keep prices and stock updated. Retailers see what's really in stock." />
            <Feature icon={<BarChart3 className="h-5 w-5" />} title="Ledgers" desc="Automatic invoices and payments — no more paper khata." />
            <Feature icon={<Sparkles className="h-5 w-5" />} title="Admin Console" desc="Manage distributors, retailers, and see platform metrics." />
          </div>
        </div>
      </section>

      {/* AI */}
      <section id="ai" className="py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> AI Features (Planned)
            </span>
            <h2 className="mt-3 text-2xl lg:text-3xl font-extrabold text-slate-900">
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
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Bot className="h-4 w-4 text-brand-600" /> Bizztob Assistant
            </div>
            <div className="mt-4 space-y-3">
              <ChatBubble self>How many orders are pending today?</ChatBubble>
              <ChatBubble>
                You have <strong>4 pending orders</strong> worth Rs 48,200.
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

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10">
          <div className="grad-border p-8 lg:p-12 bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Ready to digitize your distribution?
              </h3>
              <p className="text-slate-600 mt-2">
                Set up in minutes. No credit card required.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/signup" className="btn-primary h-11 px-6">
                Create account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-secondary h-11 px-6">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Bizztob</span>
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
      <div className="h-10 w-10 rounded-lg bg-brand-100 text-brand-600 grid place-items-center">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
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
            ? "bg-brand-gradient text-white rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
