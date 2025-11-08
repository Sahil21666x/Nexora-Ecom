# Nexora-ecom

Full-stack simple e-commerce demo built with:
- Backend: Node + Express + MongoDB (Mongoose)
- Frontend: React + Vite + Tailwind CSS
- UI primitives from Radix + shadcn-style components

---

# Screenshots

![Home Page](./screenshots/Screenshot%202025-11-07%20213734.png)
*Home Page with Product Listing*

![Product Details](./screenshots/Screenshot%202025-11-07%20213840.png)
*Shopping Cart*

![Shopping Cart](./screenshots/Screenshot%202025-11-07%20213849.png)
*Checkout Process - Step 1*

![Checkout Step 1](./screenshots/Screenshot%202025-11-07%20213903.png)
*Checkout Process - Step 2*

![Checkout Step 2](./screenshots/Screenshot%202025-11-07%20213911.png)
*Checkout Process - Step 3*

![Order Summary](./screenshots/Screenshot%202025-11-07%20213937.png)
*Order Summary (Mobile View)*

![Payment](./screenshots/Screenshot%202025-11-07%20213952.png)
*Payment Information (Mobile view)*

![Order Confirmation](./screenshots/Screenshot%202025-11-07%20214006.png)
*Order Confirmation (Mobile view)*

## Quick overview
This repository contains a small e-commerce demo designed for learning and prototyping. It has:
- Product listing (fetched or proxied from a mock API)
- Cart: add, update quantity, remove
- Checkout flow that persists orders to MongoDB

Split into two apps:
- `backend/` — Express server, Mongoose models, API routes
- `frontend/` — React (Vite) app with UI components and pages

---

## Table of contents
- [Prerequisites](#prerequisites)
- [Local setup (Windows / PowerShell)](#local-setup-windows--powershell)
- [Environment variables](#environment-variables)
- [Start backend](#start-backend)
- [Start frontend](#start-frontend)
- [API reference (summary)](#api-reference-summary)
- [Common issues & fixes](#common-issues--fixes)
- [Project structure](#project-structure)
- [Next steps / optional improvements](#next-steps--optional-improvements)

---

## Prerequisites
- Node.js v18+ (recommended, project was tested with Node 20.x)
- npm (bundled with Node) or yarn
- MongoDB (Atlas or local). If using Atlas, obtain a connection string.

---

## Local setup (Windows / PowerShell)
Open two terminals (one for backend, one for frontend). Commands below are for PowerShell.

1) Backend

```powershell
cd d:\Projects\Nexora-ecom\backend
npm install
# Create a .env file with MONGODB_URI (see section below)
# Start dev server (uses nodemon if available)
npm run dev
# or
node index.js
```

2) Frontend

```powershell
cd d:\Projects\Nexora-ecom\frontend
npm install
npm run dev
# Vite should open the frontend (default http://localhost:5173)
```

Defaults used by the apps:
- Backend server: http://localhost:5000 (verify `backend/index.js` for exact port)
- Frontend: Vite dev server (commonly http://localhost:5173)

---

## Environment variables
Backend expects a `.env` file (in `backend/`) with at least the MongoDB URI:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=5000
```

Do not commit `.env` or credentials to source control.

---

## Start backend (details)
- `backend/index.js` is the server entry. It connects to MongoDB using `MONGODB_URI` and mounts the routes under `/api`.
- Routes live under `backend/routes/`:
  - `productRoutes.js` — product list (proxied / fetched)
  - `cartRoutes.js` — cart CRUD for demo user
  - `checkoutRoutes.js` — create orders
- Models are in `backend/model/` (`User.js`, `Cart.js`, `Checkout.js`).

If you want a quick demo user in the DB, consider running a seed script to create a `User` document (see [Next steps]()).

---

## Start frontend (details)
- Frontend root: `frontend/src/`
  - `main.jsx` mounts the app
  - `App.jsx` contains routing and top-level UI
  - Pages/components in `frontend/src/components/`:
    - `Products.jsx`, `Cart.jsx`, `Checkout.jsx`, `RegistrationForm.jsx`, `app-sidebar.jsx`
  - UI primitives in `frontend/src/components/ui/`
- Styling uses Tailwind. See `frontend/tailwind.config.js` and `frontend/src/index.css`.

API calls in the frontend expect the backend to be available at the configured URL (often proxied in development or called directly to `http://localhost:5000/api`). Check the components for the base API path if you changed ports.

---

## API reference (summary)
- GET /api/products — list products (in this demo the route may fetch a remote mock API)

Cart endpoints (see `backend/routes/cartRoutes.js`):
- GET /api/cart — fetch current demo user's cart
- POST /api/cart — add item to cart (body: productId, name, price, quantity, image)
- PUT /api/cart/:productId — update quantity (body: { quantity })
- DELETE /api/cart/:productId — remove item

Checkout endpoint (see `backend/routes/checkoutRoutes.js`):
- POST /api/checkout — submit order (order info in body)

Note: This demo often uses `User.findOne({})` to locate a single demo user. If no user exists, create one in MongoDB or extend the backend with registration endpoints.

---

## Common issues & fixes
1) ERR_MODULE_NOT_FOUND when importing models (ESM)
- Node's ESM loader requires correct relative paths and file extensions. Example import must match actual file name and include `.js`:

```js
// correct (if file is backend/model/User.js)
import User from '../model/User.js';
```

If your file is `user.js` (lowercase) import accordingly. Avoid omitting the `.js` extension when using ESM imports.

2) Mongoose OverwriteModelError: Cannot overwrite `X` model once compiled
- This happens if the same model is defined more than once during hot reloads or multiple imports.
- Fix pattern: when exporting models, write:

```js
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;
```

Apply the same pattern for other models (`User`, `Checkout`) to avoid errors during nodemon restarts.

3) Nodemon restarts and dev issues
- Ensure `type: "module"` is set in `package.json` if using ESM imports in Node.
- If you see ESM errors, double-check Node version and `package.json` `type` field.

4) Missing demo user
- Many demo endpoints call `User.findOne({})`. If not present, create a `User` document in the DB or add a seed script (see [Next steps]).

---

## Project structure (concise)
```
backend/
  index.js
  package.json
  .env (local)
  model/
    User.js
    Cart.js
    Checkout.js
  routes/
    productRoutes.js
    cartRoutes.js
    checkoutRoutes.js
frontend/
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    app/
      layout.jsx
    components/
      Products.jsx
      Cart.jsx
      Checkout.jsx
      RegistrationForm.jsx
      app-sidebar.jsx
    components/ui/
      button.jsx
      card.jsx
      input.jsx
      sheet.jsx
      tooltip.jsx
    hooks/
      use-mobile.jsx

README.md (this file)
```

---

## Next steps / optional improvements
- Add a `backend/seed.js` script to create a demo user and sample cart (quick local bootstrap).
- Add integration tests or a Postman collection for the API.
- Add Dockerfile(s) and a docker-compose for easy local dev with MongoDB.
- Add CI (GitHub Actions) for linting and test runs.

---

## Troubleshooting checklist (fast)
- Backend fails to start: check `.env` & MONGODB_URI. Look for ESM import path typos.
- `ERR_MODULE_NOT_FOUND`: ensure imports include `.js` and correct relative path.
- `OverwriteModelError`: use `mongoose.models.X || mongoose.model(...)` in model files.

---
