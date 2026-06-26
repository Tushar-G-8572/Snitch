<div align="center">

<h1>🛍️ Snitch</h1>

<p><strong>A full-stack AI-powered e-commerce platform where you can negotiate your cart total with an AI — and actually win discounts.</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

</div>

---

## 📌 What is Snitch?

Snitch is a **production-grade full-stack e-commerce platform** with one feature you won't find on Amazon — an **AI negotiation assistant** that lets you haggle your cart total down and earn real discount coupons.

It supports two user roles:

-  **Buyers** — browse products, manage cart and wishlist, negotiate prices with AI, and pay via Razorpay
-  **Sellers** — list and manage products with image uploads, variant support, and a dedicated dashboard

> Built to demonstrate Redis caching at scale, real-time AI streaming via Socket.IO, LangChain orchestration, and a clean role-based full-stack architecture.

---

## 🎬 Demo

🌐 **Live:** [snitch-w2kp.onrender.com](https://snitch-w2kp.onrender.com)
---

## ✨ Features

- 🤖 **AI negotiation assistant** — chat with a Mistral AI agent to negotiate your cart total down via Socket.IO real-time streaming
- 🎟️ **AI-generated discount coupons** — after 3 successful negotiation rounds, earn `SNITCH5`, `SNITCH10`, or `SNITCH15` discount codes, validated and applied via Redis
- ⚡ **Redis caching** — API response times reduced by up to **96%** through Redis-backed user session caching and MongoDB aggregation pipeline optimization
- 💳 **Razorpay checkout** — full payment order creation and server-side verification flow
- 🏪 **Seller dashboard** — create, edit, delete, and manage products with image + variant support
- 🖼️ **ImageKit integration** — cloud image storage and optimization for all product images
- 🔐 **Authentication** — email/password registration, Google OAuth 2.0 via Passport.js, JWT cookie sessions
- ❤️ **Wishlist** — save and manage favourite products
- 📦 **Order management** — place and view completed orders
- 📱 **Responsive UI** — React 19 + Tailwind CSS + Redux Toolkit

---

## 🏗️ Architecture <a name="architecture"></a>

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT                            │
│     React 19 + Vite + Redux Toolkit + Tailwind CSS               │
│                                                                  │
│   ┌─────────────┐  ┌───────────────┐  ┌───────────────────────┐ │
│   │  Auth Pages │  │ Product Pages │  │  AI Negotiation Chat  │ │
│   │  Login/Reg  │  │ Browse/Detail │  │  Socket.IO + streaming│ │
│   └──────┬──────┘  └───────┬───────┘  └──────────┬────────────┘ │
└──────────┼─────────────────┼─────────────────────┼──────────────┘
           │    REST API      │                     │  WebSocket
           ▼                 ▼                     ▼
┌──────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                             │
│              Node.js + Mongoose + Passport.js                    │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Auth Router │  │Product Router│  │    Cart Router        │   │
│  │ /api/auth   │  │ /api/product │  │    /api/cart          │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                │                      │               │
│         └────────────────┼──────────────────────┘               │
│                          ▼                                       │
│              ┌───────────────────────┐                          │
│              │   Service Layer       │                          │
│              │                       │                          │
│   ┌──────────┤  AI Negotiation Svc  ├──────────┐               │
│   │          │  Payment Svc          │          │               │
│   │          │  Image Upload Svc     │          │               │
│   │          └───────────────────────┘          │               │
│   ▼                     ▼                       ▼               │
│ ┌──────────┐   ┌────────────────────┐   ┌─────────────────┐    │
│ │ MongoDB  │   │   LangChain        │   │     Redis        │    │
│ │ Users    │   │   Mistral AI       │   │  Session Cache  │    │
│ │ Products │   │   Socket.IO stream │   │  Coupon Mgmt    │    │
│ │ Orders   │   │   [OFFER:<amount>] │   │  96% faster API │    │
│ │ AI Sess. │   └────────────────────┘   └─────────────────┘    │
│ └──────────┘                                                     │
└──────────────────────────────────────────────────────────────────┘
           │                                       │
           ▼                                       ▼
     ┌──────────┐                          ┌──────────────┐
     │ ImageKit │                          │   Razorpay   │
     │ Product  │                          │   Payment    │
     │ Images   │                          │   Gateway    │
     └──────────┘                          └──────────────┘
```

### Services Overview

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| Frontend | React 19 + Vite + Redux | UI, state, routing, Socket.IO client |
| API Server | Node.js + Express.js | REST endpoints, auth middleware, request validation |
| AI Service | LangChain + Mistral AI | Negotiation agent, streaming offer logic |
| Real-time | Socket.IO | Live AI negotiation sessions, token streaming |
| Database | MongoDB + Mongoose | Users, products, carts, orders, AI sessions |
| Cache | Redis | Session caching, coupon validation, 96% faster reads |
| Payments | Razorpay | Order creation + server-side payment verification |
| Images | ImageKit | Product image storage, CDN delivery |
| Auth | Passport.js + JWT | Google OAuth, cookie-based sessions |

---

## 🛠️ Tech Stack

### Backend
| Technology | Usage |
|-----------|-------|
| Node.js + Express.js | REST API server + Socket.IO server |
| MongoDB + Mongoose | Users, products, carts, orders, negotiation sessions |
| Redis | Session caching, coupon code storage + validation |
| LangChain | AI negotiation agent orchestration |
| Mistral AI | Negotiation LLM model |
| Socket.IO | Real-time bidirectional negotiation stream |
| Passport.js | Google OAuth 2.0 |
| JWT | Cookie-based session authentication |
| Razorpay | Payment order creation and verification |
| ImageKit | Product image storage and CDN |
| Nodemailer | Email communication |
| bcrypt | Password hashing |

### Frontend
| Technology | Usage |
|-----------|-------|
| React 19 + Vite | Main UI |
| Redux Toolkit | Auth, cart, product, negotiation state |
| Tailwind CSS | Component styling |
| React Router | Client-side routing + protected routes |
| Axios | API requests |
| Socket.IO Client | Real-time negotiation chat |

---

## 📁 Project Structure

```
snitch/
├── backend/
│   ├── server.js                   # Entry point — HTTP server + Socket.IO setup
│   └── src/
│       ├── app.js                  # Express app config + middleware
│       ├── config/
│       │   ├── db.js               # MongoDB connection
│       │   ├── redis.js            # Redis client setup
│       │   └── passport.js         # Google OAuth config
│       ├── routers/
│       │   ├── auth.router.js      # Auth routes
│       │   ├── product.router.js   # Product + wishlist routes
│       │   └── cart.router.js      # Cart + payment + coupon routes
│       ├── controller/
│       │   ├── auth.controller.js
│       │   ├── product.controller.js
│       │   └── cart.controller.js
│       ├── models/
│       │   ├── user.model.js       # User + role schema
│       │   ├── product.model.js    # Product + variants schema
│       │   ├── cart.model.js
│       │   ├── order.model.js
│       │   └── aiSession.model.js  # Negotiation session schema
│       ├── services/
│       │   ├── ai.service.js       # LangChain negotiation agent + streaming
│       │   ├── payment.service.js  # Razorpay order + verify
│       │   └── image.service.js    # ImageKit upload handler
│       ├── middleware/
│       │   └── auth.middleware.js  # JWT verification
│       └── validators/             # Request validation middleware
│
└── frontend/
    └── src/
        ├── main.jsx                # React bootstrap
        ├── app/
        │   ├── App.jsx             # Top-level layout + store
        │   └── app.routes.jsx      # Protected + public routes
        └── feature/
            ├── auth/               # Login, Register, Google OAuth
            ├── product/            # Browse, Detail, Seller Dashboard
            │   ├── AI/
            │   │   └── Negotiation.jsx  # Live AI negotiation UI
            │   └── services/       # Product + cart API clients
            └── auth/services/      # Auth API client
```

---

## 🚀 Getting Started <a name="getting-started"></a>

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Redis instance
- Mistral AI API key
- Google OAuth credentials
- Razorpay account (Key ID + Secret)
- ImageKit account

### 1. Clone the repository

```bash
git clone https://github.com/Tushar-G-8572/Snitch.git
cd Snitch
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables

Create a `.env` file inside `backend/`:

```env
# Server
PORT=5000
NODE_ENV=development
BASE_URI=http://localhost:5000

# Database
MONGODB_URI=your_mongodb_connection_string

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# AI
MISTRAL_API_KEY=your_mistral_api_key

# Auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Image Upload
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

> ⚠️ Never commit `.env` to source control. Add it to `.gitignore`.

### 4. Run the application

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user with email + password |
| `POST` | `/api/auth/login` | Login, issue JWT cookie |
| `GET` | `/api/auth/get-me` | Fetch authenticated user profile |
| `GET` | `/api/auth/google` | Initiate Google OAuth flow |
| `GET` | `/api/auth/google/callback` | Google OAuth callback, issue JWT |
| `POST` | `/api/auth/change-role` | Switch between Buyer and Seller roles |
| `POST` | `/api/auth/update/profile` | Update user profile details |
| `GET` | `/api/auth/logout` | Clear auth cookie |

### Products (`/api/product`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/product/` | List all products |
| `POST` | `/api/product/list-product` | Create a product *(Seller only)* |
| `GET` | `/api/product/seller` | Get authenticated seller's products |
| `POST` | `/api/product/seller/product/:id` | Edit a product *(Seller only)* |
| `PUT` | `/api/product/seller/product/:id/variants` | Update product variants |
| `GET` | `/api/product/product/:id` | Get product detail |
| `PATCH` | `/api/product/product/add-wishlist/:id` | Toggle wishlist |
| `GET` | `/api/product/wishlist` | Get user wishlist |
| `DELETE` | `/api/product/delete/:id` | Delete a product *(Seller only)* |

### Cart & Checkout (`/api/cart`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/cart/add/:productId` | Add item or variant to cart |
| `GET` | `/api/cart/` | Get cart contents |
| `PATCH` | `/api/cart/item/:itemId` | Update cart item quantity |
| `DELETE` | `/api/cart/item/:itemId` | Remove item from cart |
| `POST` | `/api/cart/payment/create/order` | Create Razorpay payment order |
| `POST` | `/api/cart/payment/varify/order` | Verify Razorpay payment server-side |
| `GET` | `/api/cart/order` | Get completed orders |
| `POST` | `/api/cart/discount` | Apply AI-generated coupon code |

### Socket.IO Events (AI Negotiation)

| Event | Direction | Description |
|-------|-----------|-------------|
| `negotiation_start` | Client → Server | Open a new negotiation session |
| `chat_message` | Client → Server | Send user negotiation message |
| `token` | Server → Client | Streaming AI response chunk |
| `stream_end` | Server → Client | End of response with negotiation state + offer |
| `stream_error` | Server → Client | Negotiation error |

---

## 🤖 AI Negotiation Flow

The AI negotiation is the standout feature of Snitch. Here's exactly how it works:

```
1. Buyer opens the negotiation page with items in cart
2. Socket.IO connection established → negotiation session created in MongoDB
3. Buyer sends opening message (e.g. "Can I get a better deal?")

   Round 1:
   Buyer message → Socket.IO → LangChain Mistral AI Agent
   AI evaluates cart total → responds with counter-offer
   Response streams back token-by-token via `token` event
   AI embeds offer in format: [OFFER:<amount>]

   Round 2:
   Buyer counters → AI responds with adjusted offer

   Round 3 (final):
   If buyer accepts → AI issues coupon code:
     ├── SNITCH5  → 5% discount
     ├── SNITCH10 → 10% discount
     └── SNITCH15 → 15% discount (best deal)

4. Coupon code stored in Redis with expiry
5. Buyer applies coupon at checkout → POST /api/cart/discount
6. Redis validates coupon → discount applied to cart total
7. Buyer proceeds to Razorpay payment with discounted amount
```

**Redis caching** reduced product and session API response times by up to **96%** compared to direct MongoDB queries — measured using MongoDB aggregation pipeline benchmarking.

---

## 👨‍💻 Author

**Tushar Gupta**
- GitHub: [@Tushar-G-8572](https://github.com/Tushar-G-8572)
- LinkedIn: [tushar-gupta-018805259](https://www.linkedin.com/in/tushar-gupta-018805259/)
- Portfolio: [portfolio-tg-3g81.onrender.com](https://portfolio-tg-3g81.onrender.com)

---

<div align="center">
  <p>If you found this project helpful or interesting, consider giving it a ⭐</p>
</div>
