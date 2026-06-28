# FreshKart - MERN Stack E-Commerce App

A full-stack grocery/e-commerce web application built with MongoDB, Express, React, and Node.js. Includes JWT-based authentication and Razorpay payment gateway integration.

## Features

- Browse products without login (view + add to cart)
- Sign up / Login with JWT authentication
- Order placement is locked until the user logs in
- Razorpay payment gateway - order is only created in the database after payment is verified
- Order history page ("My Orders")
- Search and category filter on the product listing page

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios, plain CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken) + bcryptjs for password hashing
- **Payments:** Razorpay

## Folder Structure

```
mern-ecommerce/
├── backend/
│   ├── config/db.js
│   ├── models/ (User, Product, Order)
│   ├── routes/ (auth, product, order, payment)
│   ├── middleware/authMiddleware.js
│   ├── seed.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/ (Navbar, ProductCard, ProtectedRoute)
    │   ├── context/ (AuthContext, CartContext)
    │   ├── pages/ (Home, Login, Signup, Cart, Checkout, MyOrders, OrderSuccess)
    │   ├── api/axiosInstance.js
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

## Setup Instructions

### 1. Prerequisites

- Node.js installed (v18+)
- MongoDB installed locally OR a free MongoDB Atlas cluster
- A Razorpay account (see steps below to get test keys)

### 2. Getting Razorpay Test API Keys (free, takes 2 minutes)

1. Go to https://dashboard.razorpay.com/signup and create a free account.
2. After signing up, you'll land on the Razorpay Dashboard. Make sure the toggle in the top-left says **"Test Mode"** (it's on by default for new accounts).
3. Go to **Settings → API Keys** (left sidebar, under "Account & Settings").
4. Click **"Generate Test Key"**.
5. Copy the **Key Id** and **Key Secret** shown. (The secret is shown only once, so save it somewhere safe.)
6. Paste these into `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_here
   ```

**Testing payments:** In test mode, Razorpay gives you dummy card numbers/UPI IDs to simulate payments without real money. The most common one:
- Card Number: `4111 1111 1111 1111`
- Any future expiry date, any CVV
- For UPI testing, use: `success@razorpay`

Full list of test credentials: https://razorpay.com/docs/payments/payments/test-card-upi-details/

### 3. Backend Setup

```bash
cd backend
npm install
```

Update `backend/.env` with your own values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=any_random_secret_string_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

If using MongoDB Atlas instead of local MongoDB, replace `MONGO_URI` with your Atlas connection string.

Seed the database with sample products:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### 5. Using the App

1. Open `http://localhost:5173` in your browser
2. Browse products, add items to cart (no login required for this part)
3. Click "Checkout" — you'll be asked to login/signup first
4. After login, fill in shipping address and click "Pay"
5. Razorpay popup opens — use test card `4111 1111 1111 1111` to simulate payment
6. After successful payment, the order is verified and saved to the database
7. View your order in "My Orders"

## How the Auth + Payment Flow Works

1. **Browsing & Cart:** Anyone can view products and add to cart. Cart is stored in `localStorage` so it persists even before login.
2. **Login Gate:** Clicking "Checkout" checks if the user is logged in. If not, they're redirected to the login page and brought back to checkout after logging in.
3. **JWT Auth:** On login/signup, the backend returns a JWT token which is stored in `localStorage` and sent in the `Authorization` header for protected requests (payment + order routes).
4. **Razorpay Flow:**
   - Frontend asks backend to create a Razorpay order (`/api/payment/create-order`)
   - Backend creates the order using the Razorpay SDK and returns an `order_id`
   - Frontend opens the Razorpay checkout popup using that `order_id`
   - User completes payment in the popup
   - Razorpay returns a `payment_id` and `signature` to the frontend
   - Frontend sends these to the backend (`/api/payment/verify`) to verify the payment signature using HMAC SHA256
   - Only if verification succeeds does the frontend call `/api/orders` to actually save the order in MongoDB

## Notes

- This project intentionally keeps things simple (plain CSS, no Redux, no TypeScript) to reflect a junior developer / intern-level skill set.
- Admin panel for adding products is not included — products are added via the seed script. You can manually add more by editing `backend/seed.js` and re-running `npm run seed`.
