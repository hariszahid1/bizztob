# Bizztob

A B2B SaaS platform that connects local retail shops with their distributors. Retailers place orders digitally, distributors manage orders, deliveries, and ledgers — all from one platform.

Built as a single mobile-responsive Next.js web app so you can run it entirely on `localhost` (no mobile-app build required).

## Features (Phase 1 MVP)

### Retailer
- Sign up / sign in
- Browse distributor catalogs (search + filter)
- Add to cart, place orders (single distributor per order)
- Track order status timeline (Pending → Confirmed → Dispatched → Delivered)
- View simple ledger (invoices, payments, running balance)
- AI Assistant (rules-based demo, ready to plug in an LLM)

### Distributor
- Dashboard with pending orders, today's orders, outstanding balances, top-selling products
- Manage products (create/edit/delete, prices, stock, category, image)
- Receive & confirm orders, schedule deliveries (address / driver / vehicle / date)
- Advance orders through statuses; delivered orders auto-generate an invoice ledger entry
- Deliveries page (scheduled/dispatched/delivered)
- Retailer ledgers with running balance and payment recording
- Retailers list (only those who have ordered)

### Admin
- Platform overview: totals for distributors, retailers, products, GMV
- List of all distributors & retailers
- Recent orders across the platform

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + Lucide icons (mobile responsive)
- **DB:** PostgreSQL 16 (via Prisma) with native enums
- **Auth:** JWT httpOnly cookies (via `jose`), bcrypt hashing
- **Validation:** Zod

## Getting Started (localhost)

Requires Node.js 18.18+ and a running PostgreSQL instance.

### 1) Start PostgreSQL

Pick one of these three options:

**Option A — Docker (recommended, one command):**

```bash
docker compose up -d
```

This starts Postgres 16 on `localhost:5432` with database/user/password all set to `bizztob` — matching the default `DATABASE_URL` in `.env`.

**Option B — Local Postgres (Ubuntu/Debian):**

```bash
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER bizztob WITH PASSWORD 'bizztob';"
sudo -u postgres psql -c "CREATE DATABASE bizztob OWNER bizztob;"
```

**Option C — Bring your own Postgres:**

Edit `.env` and set `DATABASE_URL` to your Postgres connection string:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
```

### 2) Install, migrate, seed, run

```bash
# Install dependencies
npm install

# Create tables and seed demo data
npx prisma migrate dev --name init
npm run db:seed

# Start the dev server
npm run dev
```

Open http://localhost:3000

### Useful DB scripts

| Command                     | What it does                                            |
| --------------------------- | ------------------------------------------------------- |
| `npm run db:migrate`        | Create / apply migrations in dev                        |
| `npm run db:push`           | Sync schema without migrations (quick prototyping)      |
| `npm run db:seed`           | Insert demo data                                        |
| `npm run db:reset`          | Drop & recreate DB, apply migrations, re-seed           |
| `npm run db:studio`         | Open Prisma Studio (visual DB browser)                  |

## Demo Accounts (seeded)

| Role        | Email                     | Password    |
| ----------- | ------------------------- | ----------- |
| Admin       | admin@bizztob.com         | admin123    |
| Distributor | distributor@bizztob.com   | dist123     |
| Distributor | distributor2@bizztob.com  | dist123     |
| Retailer    | retailer@bizztob.com      | retail123   |
| Retailer    | retailer2@bizztob.com     | retail123   |

Or use the "Admin / Distributor / Retailer" quick-fill buttons on the sign-in page.

## Project Structure

```
prisma/
  schema.prisma      # DB schema (SQLite)
  seed.ts            # Demo seed (users, products, orders, ledger)
src/
  app/
    page.tsx         # Landing page
    login/, signup/  # Auth pages
    retailer/        # Retailer app (catalog, orders, ledger, assistant)
    distributor/     # Distributor console
    admin/           # Admin console
    api/             # Route handlers (auth, orders, products, ledger, assistant)
  components/        # Shared UI (DashboardShell, Logo, StatCard)
  lib/               # db.ts (Prisma), auth.ts, utils.ts
  middleware.ts      # Route protection by role
```

## Roadmap (AI Features)

Placeholder logic and UI is wired up. Swap the rules-based endpoints for a real LLM later.

- Smart reorder suggestions (based on retailer order history)
- Demand forecasting for distributors
- Invoice scanning via OCR
- Chatbot assistant on live user data

## Notes

- All prices are in PKR (Rs). Change `formatCurrency` in `src/lib/utils.ts` to switch currency.
- Change `JWT_SECRET` in `.env` before production.
- The default DB URL points at the Docker Postgres in `docker-compose.yml`. Change it in `.env` to point at your own Postgres.
