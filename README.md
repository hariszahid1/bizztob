# Bizztob

A B2B SaaS platform that connects local retail shops with their distributors. Retailers place orders digitally, distributors manage orders, deliveries, and ledgers — all from one platform.

Built as a single mobile-responsive Next.js web app so you can run it entirely on `localhost` (no separate mobile app build).

## Features (Phase 1 MVP)

### Retailer
- Sign up / sign in
- Browse the market (top-nav catalog with per-distributor product grids)
- Cart with quantity inputs, delivery address, request-pending, and green "Request Order" button
- Track order status (In Review → Accepted → Dispatched → Delivered / Rejected)
- Dashboard, Orders (with metric cards), Order Details, Messages, Payment, Ledger

### Distributor
- Dashboard with total orders, revenue, retailer count, and Delivered / Pending / Rejected progress rings
- Orders: progress cards + table with `edit` / `view` actions
- Products: table view + split-view Add / Edit product (image on left, fields on right)
- Inventory (companies + products), Connections (retailers), Team (member management stub)
- Payment: total sale, paid, pending — plus pending/paid retailer tables
- Ledger: wide table with Invoice Date, ID, Retailer, Total, Paid, **Balance Due**, Due Date, Payment 1/2
- Settings

### Admin
- Platform overview: distributors, retailers, products, GMV
- List of all distributors & retailers

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + Poppins + Lucide icons (mobile responsive, brand blue→purple gradient)
- **DB:** MongoDB 7 (via Prisma) — runs as a single-node replica set for transaction support
- **Auth:** JWT httpOnly cookies (via `jose`), bcrypt hashing
- **Validation:** Zod

## Getting Started (localhost)

Requires Node.js 18.18+ and a running MongoDB replica set.

### 1) Start MongoDB

Pick **one** of these three options:

**Option A — Docker (recommended, one command):**

```bash
docker compose up -d
```

This starts MongoDB 7 on `localhost:27017` as a single-node replica set (`rs0`). The healthcheck auto-initiates the replica set on first launch. Wait ~15 seconds for the healthcheck to go green:

```bash
docker compose ps
# Wait until STATUS shows "healthy"
```

**Option B — MongoDB Atlas (free cloud cluster):**

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add your IP to the access list, create a DB user
3. Copy the connection string and paste it into `.env`:

```
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bizztob?retryWrites=true&w=majority"
```

**Option C — Local MongoDB install:**

You need MongoDB 4.0+ running as a **replica set** (transactions require this):

```bash
# Start mongod with --replSet rs0
mongod --replSet rs0 --bind_ip localhost --port 27017 --dbpath /path/to/data
# In another shell, initiate the replica set (only needed once)
mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
```

Default `DATABASE_URL` in `.env` will connect to it out of the box.

### 2) Install, sync schema, seed, run

```bash
# Install dependencies (already done if you ran this before)
npm install

# Create collections + indexes and seed demo data
npm run setup

# Start the dev server
npm run dev
```

Open http://localhost:3000

### Useful scripts

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run db:push`   | Sync Prisma schema → MongoDB collections & indexes |
| `npm run db:seed`   | Insert / reset demo data                           |
| `npm run db:studio` | Open Prisma Studio (visual DB browser)             |
| `npm run setup`     | `db:push` then `db:seed` in one shot               |

## Demo Accounts (seeded)

| Role        | Email                     | Password  |
| ----------- | ------------------------- | --------- |
| Admin       | admin@bizztob.com         | admin123  |
| Distributor | distributor@bizztob.com   | dist123   |
| Distributor | distributor2@bizztob.com  | dist123   |
| Retailer    | retailer@bizztob.com      | retail123 |
| Retailer    | retailer2@bizztob.com     | retail123 |

Or use the "Admin / Distributor / Retailer" quick-fill buttons on the sign-in page.

## Project Structure

```
prisma/
  schema.prisma       # Prisma schema (MongoDB provider, native enums, ObjectId ids)
  seed.ts             # Demo seed (users, products, orders, ledger)
src/
  app/
    page.tsx          # Landing page
    login/, signup/   # Auth pages (gradient-border card + illustration)
    retailer/
      (dashboard)/    # Sidebar layout: dashboard, orders, ledger, payment, messages
      (market)/       # Top-nav layout: market, cart
    distributor/      # Sidebar console: dashboard, orders, products, inventory,
                      # connections, team, payment, ledger, settings
    admin/            # Admin console
    api/              # Route handlers (auth, orders, products, ledger)
  components/         # DashboardShell, MarketTopNav, Logo, ProgressRing, DeliveryIllustration
  lib/                # db.ts (Prisma), auth.ts, utils.ts, cart.ts
  middleware.ts       # Route protection by role
```

## Roadmap (AI Features)

Placeholder logic and UI hooks are ready. Swap for a real LLM later.

- Smart reorder suggestions (based on retailer order history)
- Demand forecasting for distributors
- Invoice scanning via OCR
- Chatbot assistant on live user data

## Notes

- All prices are in PKR (`Rs. 12,000`). Change `formatCurrency` in `src/lib/utils.ts` to switch currency.
- Change `JWT_SECRET` in `.env` before production.
- MongoDB replica set is required (single-node is fine for local dev). The provided `docker-compose.yml` handles this automatically.
- If you switch to MongoDB Atlas, update `DATABASE_URL` and re-run `npm run setup`.
