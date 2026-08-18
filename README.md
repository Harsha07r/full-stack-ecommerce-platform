# MARLOW

A full-stack e-commerce site for a contemporary ready-to-wear brand — product
browsing with search/filter/sort, cart, authentication, checkout, order
history, and an admin panel for managing products, categories, and orders.

Built as a take-home assignment. Time was the binding constraint, so a few
features were deliberately left out — see [What was cut](#what-was-cut).

## Stack

| | |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Context API |
| Backend | Node, Express 5, Mongoose 9, JWT, bcrypt |
| Database | MongoDB Atlas |
| Deploy | Vercel (client), Render (server) |

No Redux, no Next.js, no UI kit, no form libraries — Context API and plain
`useState` cover everything the app needs.

## Architecture

```
client/src/
  components/{ui,layout,product,cart,admin}/   reusable UI pieces
  pages/            route-level screens
  pages/admin/      admin-only screens
  layouts/          ShopLayout, AdminLayout, ProtectedRoute, AdminRoute
  context/          CartContext (localStorage-backed), AuthContext
  hooks/            data-fetching hooks (useProducts, useOrders, useCategories)
  services/         all API calls live here — components never call axios directly
  data/             static UI chrome (category labels, size list)

server/
  models/           User, Product, Category, Order
  controllers/       route handlers
  routes/            Express routers
  middleware/         protect (JWT auth), admin (role check), error handler
  seed/               seed.js — populates categories/products/an admin user
```

Cart line items are keyed `${productId}__${size}` — the same product in two
sizes is two separate lines. Product stock is tracked per size
(`sizes: [{ size, stock }]`) and decremented atomically when an order is
placed, after validating every line has enough stock.

## Getting started

Requires Node 18+ and a MongoDB Atlas connection string (free tier is fine).

```bash
# clone, then:
cd server && npm install
cd ../client && npm install
```

Copy the env templates and fill in real values:

```bash
cd server && copy .env.example .env
cd ../client && copy .env.example .env
```

`server/.env` needs `MONGO_URI` (your Atlas string) and `JWT_SECRET` (any
long random string). `client/.env` only needs `VITE_API_URL` if your backend
isn't running on the default `http://localhost:5000/api`.

Seed the database (creates 5 categories, 6 products, and an admin user):

```bash
cd server && npm run seed
```

Run both servers (separate terminals):

```bash
cd server && npm run dev    # http://localhost:5000
cd client && npm run dev    # http://localhost:5173
```

Log in as the seeded admin with the credentials in `server/.env.example`
(`ADMIN_EMAIL`/`ADMIN_PASSWORD`, defaulted if you didn't override them) to
reach `/admin`.

## API

All routes are prefixed `/api`. Auth via `Authorization: Bearer <token>`.

| Method | Route | Access |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | public |
| GET | `/auth/me` | logged in |
| GET | `/products`, `/products/:id` | public |
| POST/PUT/DELETE | `/products`, `/products/:id` | admin |
| GET | `/categories` | public |
| POST/PUT/DELETE | `/categories/:id` | admin |
| POST | `/orders` | logged in |
| GET | `/orders/mine`, `/orders/:id` | logged in (own orders, or admin for any) |
| GET | `/orders` | admin |
| PUT | `/orders/:id/status` | admin |

## Deployment

**Backend (Render):** New → Blueprint, point at this repo — `render.yaml` at
the repo root configures the service (root dir `server`, `npm install` /
`npm start`). Render will prompt for the env vars marked `sync: false`:
`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (set this once you know the Vercel
URL — update and redeploy after step 2).

**Frontend (Vercel):** New Project → import this repo → set **Root
Directory** to `client` (Vercel auto-detects the Vite framework preset from
there). Add an env var `VITE_API_URL` pointing to the deployed Render URL
plus `/api` (e.g. `https://marlow-api.onrender.com/api`).

Circle back to the Render service afterward and set `CLIENT_URL` to the
final Vercel URL, since the backend's CORS is locked to that single origin.

## What was cut

No payment gateway, image upload, wishlist, or reviews — explicitly
deprioritized to protect the core flow (browse → cart → checkout → order
history → admin management) under a fixed deadline. Product images are
static files in `client/public/products/`, referenced by path in the
database rather than uploaded through the app.
