# MARLOW

MARLOW is a full-stack e-commerce platform for a contemporary ready-to-wear brand, built as a take-home assignment. It implements the complete core shopping journey — product discovery, cart, authentication, checkout, and order history — alongside an admin system for managing the catalog and fulfilling orders. The application is a MERN-style stack (MongoDB, Express, React, Node) with a separately deployed frontend and backend.

## Live Demo

- **Live Application:** https://full-stack-ecommerce-platform-omega.vercel.app
- **GitHub Repository:** https://github.com/Harsha07r/full-stack-ecommerce-platform

## Features

### Customer

- Product browsing with category tiles and a "New Arrivals" grid on the homepage
- Search, category filtering, sorting (featured / price / alphabetical), and an in-stock-only toggle on the product listing page
- Product detail pages with per-size selection — out-of-stock sizes are shown disabled rather than hidden
- Registration and login (JWT-based)
- Cart with quantity adjustment and line removal
- Persistent, per-account cart — stored in `localStorage`, scoped separately per user (not shared across accounts on the same browser). A cart built while logged out is merged into the account's cart on login, since checkout requires authentication
- Checkout with a shipping address form, protected behind login
- Order confirmation page after a successful purchase
- Order history showing past orders and their current status

### Admin

- Role-based access control — an `/admin` area gated to accounts with an `admin` role, with the admin navigation link hidden entirely for other users
- Product management: create, edit, and delete products
- Per-size inventory management as part of the product form (stock is tracked per size, not per product)
- Category management: create, rename, and delete categories
- Order management: view all orders across all customers, with the customer's name/email attached
- Order status updates (pending → processing → shipped → delivered, or cancelled) via a dropdown per order

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Context API |
| Backend | Node.js, Express 5, Mongoose 9, JWT (jsonwebtoken), bcryptjs |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend), Render (backend) |

No Redux, no server-side rendering framework, no UI component library, no form library — the app's state and UI needs are covered by React Context and plain component composition.

## Architecture

```
client/src/
  components/       reusable UI (layout, product cards, form fields, buttons)
  pages/            route-level screens (home, listing, detail, cart, checkout, auth)
  pages/admin/      admin-only screens (products, categories, orders)
  layouts/          route wrappers — ShopLayout, AdminLayout, ProtectedRoute, AdminRoute
  context/          AuthContext, CartContext
  hooks/            data-fetching hooks (useProducts, useOrders, useCategories)
  services/         all API calls — components never call axios directly
  data/             static UI chrome (category labels, size list)

server/
  models/           User, Product, Category, Order
  controllers/      request handling and business logic
  routes/           Express route definitions
  middleware/       auth (JWT verification, role check), centralized error handler
  seed/             seed.js — populates categories, products, and an admin user
```

**Request flow:** a page calls a function in `services/` → that hits an Express route → route-level middleware runs (JWT verification via `protect`, and `admin` for admin-only routes) → the controller executes the business logic → a Mongoose model reads/writes MongoDB.

**Authentication:** login/register issue a JWT (30-day expiry) that the client stores in `localStorage` alongside the user's profile. An Axios request interceptor attaches it as `Authorization: Bearer <token>` on every outgoing request. On the backend, the `protect` middleware verifies the token and loads the user onto `req.user`; the `admin` middleware (chained after `protect`) rejects any request whose user isn't role `admin`.

**Protected routes on the frontend** mirror this: `ProtectedRoute` redirects unauthenticated visitors to `/login` (remembering where they were headed, so login sends them back), and `AdminRoute` additionally checks `role === 'admin'`, sending non-admins home instead.

## Key Implementation Details

- Cart line items are keyed `${productId}__${size}` — the same product in two sizes is two independent lines, not one line with a size field.
- Product inventory is tracked per size (`sizes: [{ size, stock }]` on the Product model), not as a single stock count.
- On order placement, every line's stock is validated *before* any stock is touched, so a failure partway through never leaves inventory decremented for only some items; valid orders then decrement stock via MongoDB's `$inc` operator.
- Order line items store a snapshot of the product's name, image, price, and size at purchase time, so a later edit to the product doesn't retroactively change historical orders.
- JWT-based authentication with centralized `protect`/`admin` middleware, rather than checking roles ad hoc in individual controllers.
- Cart state is scoped per authenticated user (with a separate slot for guest/anonymous browsing) — see [Features](#features) above.
- All API calls are centralized in `services/`; no component calls Axios directly.
- A small set of reusable UI primitives (`Button`, `FormField`, `SectionHeader`) are shared across both the customer-facing forms and the admin forms.

## API

All routes are prefixed with `/api`. Authenticated requests use `Authorization: Bearer <token>`.

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create an account, returns a JWT |
| POST | `/auth/login` | Public | Authenticate, returns a JWT |
| GET | `/auth/me` | Logged in | Return the current user |

### Products

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/products` | Public | List all products |
| GET | `/products/:id` | Public | Get a single product |
| POST | `/products` | Admin | Create a product |
| PUT | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |

### Categories

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/categories` | Public | List all categories |
| POST | `/categories` | Admin | Create a category |
| PUT | `/categories/:id` | Admin | Rename a category |
| DELETE | `/categories/:id` | Admin | Delete a category |

### Orders

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/orders` | Logged in | Place an order (validates and decrements stock) |
| GET | `/orders/mine` | Logged in | List the current user's orders |
| GET | `/orders/:id` | Logged in | Get one order (owner or admin) |
| GET | `/orders` | Admin | List every order |
| PUT | `/orders/:id/status` | Admin | Update an order's status |

## Database Design

- **User** — `name`, `email` (unique), `password` (bcrypt-hashed, excluded from query results by default), `role` (`user` \| `admin`).
- **Product** — `name`, `colour`, `price`, `compareAtPrice` (nullable — drives the "on sale" UI), `category` (reference to Category), `image` (a static file path), `description`, `details`, and `sizes` (an embedded array of `{ size, stock }`).
- **Category** — `name` and a derived `slug`, both unique.
- **Order** — `user` (reference to User), `items` (an embedded, self-contained snapshot of each purchased line — not a live reference to current product data), `shippingAddress` (embedded), `subtotal`/`shipping`/`total`, and `status`.

## Getting Started

**Requirements:** Node.js 18+ and a MongoDB Atlas connection string (the free tier is sufficient).

```bash
git clone https://github.com/Harsha07r/full-stack-ecommerce-platform.git
cd full-stack-ecommerce-platform

cd server && npm install
cd ../client && npm install
```

Configure environment variables (see [below](#environment-variables) for the full list):

```bash
# from the server/ directory
cp .env.example .env      # macOS/Linux
copy .env.example .env    # Windows

# from the client/ directory
cp .env.example .env      # macOS/Linux
copy .env.example .env    # Windows
```

Fill in `server/.env` with your own `MONGO_URI` and `JWT_SECRET`. `client/.env` only needs `VITE_API_URL` if your backend isn't running on the default `http://localhost:5000/api`.

Seed the database — creates the category set, product catalog, and an admin account:

```bash
cd server && npm run seed
```

Run both servers in separate terminals:

```bash
cd server && npm run dev    # http://localhost:5000
cd client && npm run dev    # http://localhost:5173
```

## Environment Variables

### Server (`server/.env`)

```
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

`ADMIN_EMAIL`/`ADMIN_PASSWORD` are only used once, by `npm run seed`, to create the initial admin account.

### Client (`client/.env`)

```
VITE_API_URL=
```

## Deployment

**Frontend — Vercel.** Root directory set to `client` (this is a monorepo, so Vercel needs to be pointed at the actual app root). Requires one environment variable: `VITE_API_URL`, set to the deployed backend's URL plus `/api`.

**Backend — Render.** Root directory `server`, configured via the `render.yaml` blueprint at the repo root. Requires `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (the deployed frontend's exact origin — the backend's CORS is locked to this single value, so it must be updated any time the frontend URL changes).

**Database — MongoDB Atlas**, connected to by the backend via `MONGO_URI`.

The two deploys are interdependent: the frontend needs the backend's URL to make API calls, and the backend needs the frontend's URL to allow CORS — so the backend's `CLIENT_URL` is typically set (or updated) after the frontend is deployed.

## Test Credentials

### Customer

No customer account is pre-seeded — registration is open, so create an account directly from the live site's "Create an account" link.

### Admin

Test credentials are provided separately in the submission email.

## Project Structure

```
client/
  public/products/        static product, hero, and category imagery
  src/
    components/{layout,product,ui}/
    context/               AuthContext.jsx, CartContext.jsx
    hooks/                 useProducts.js, useOrders.js, useCategories.js
    layouts/                ShopLayout.jsx, AdminLayout.jsx, ProtectedRoute.jsx, AdminRoute.jsx
    pages/                  Home, ProductListing, ProductDetail, Cart, Checkout,
                            OrderConfirmation, OrderHistory, Login, Register, NotFound
    pages/admin/            AdminProducts, AdminProductForm, AdminCategories, AdminOrders
    services/               api.js, authService.js, productService.js,
                            categoryService.js, orderService.js
  .env.example

server/
  config/db.js
  controllers/              authController.js, productController.js,
                            categoryController.js, orderController.js
  middleware/               auth.js, errorHandler.js
  models/                   User.js, Product.js, Category.js, Order.js
  routes/                   authRoutes.js, productRoutes.js, categoryRoutes.js, orderRoutes.js
  seed/                     data.js, seed.js
  server.js
  .env.example

render.yaml
```

## What Was Deliberately Excluded

To prioritize the core browse → cart → checkout → order history → admin management flow under a fixed deadline, the following non-core features were intentionally left outside the current scope: payment gateway integration, in-app image upload (product images are static files referenced by path), a wishlist, and product reviews.

## Engineering Decisions

- **Context API instead of Redux** — the app's shared state (auth session, cart) is limited in scope and doesn't warrant a separate state-management library.
- **A dedicated service layer** (`client/src/services/`) keeps all HTTP calls out of components, so UI code never touches Axios directly.
- **Controllers separated from routes** on the backend — route files only wire paths to middleware and handler functions; the handlers themselves live in `controllers/`.
- **Centralized auth middleware** (`protect`, `admin`) rather than per-route auth checks, so authorization logic lives in one place.
- **Per-size inventory** modeled as an embedded array on the Product document, since stock in this domain is inherently size-specific, not a single product-level count.
- **Snapshotted order line items** — an order stores the product name/image/price at the time of purchase, independent of later edits to the live product.
- **A small reusable component set** (`Button`, `FormField`, `SectionHeader`) shared between the storefront and admin, keeping form and CTA styling consistent across both.

## Known Limitations

- Product search, filtering, and sorting run client-side against the full product list returned by the API — appropriate at the current catalog size, but would need to move server-side (with pagination) for a much larger catalog.
- Deleting a category does not check whether products still reference it.
- No automated test suite.
- Product imagery is uploaded manually to `client/public/products/` and referenced by path; there is no in-app upload flow.
