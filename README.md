# Swaad Sevak — Restaurant Operating & QR Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-swaadsevak.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://swaadsevak.vercel.app/)

🔗 **Live Deployment:** [https://swaadsevak.vercel.app/](https://swaadsevak.vercel.app/)

**Swaad Sevak** is a modern, production-grade operating system built for Indian cafés, bistros, cloud kitchens, and dine-in establishments.

It provides an end-to-end dining and kitchen workflow:
**Restaurant Registration → 5-Step Onboarding → AI Menu Setup → Table QR Generation & ZIP Download → Customer QR Ordering → Real-time Order Alert with Ting Sound → KOT Generation → 58mm/80mm Kitchen Thermal Printing → Customer Bill Request → Digital Tax Invoice → Omnichannel Order Tracking.**

---

## 🌐 Live Demo & Quick Access

* **Live Web App:** [https://swaadsevak.vercel.app/](https://swaadsevak.vercel.app/)
* **Demo Manager Login:** Username: `demo_manager` | PIN: `1234`

## 🚀 Quick Start Guide

### 1. Start Both Frontend and Backend

From the project root:
```bash
# Starts both the Express + Socket.IO server (port 5000) and the Vite React frontend (port 5173)
npm run dev
```

Or run them individually:
```bash
# Backend (Server)
npm run dev:server

# Frontend (Client)
npm run dev:client
```

* **Manager Dashboard & Landing Page:** [http://localhost:5173](http://localhost:5173)
* **Backend API & Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 🔑 Demo Account Credentials

A sample Indian restaurant (**"The Chai & Chaat Co."**) is pre-configured with 8 tables, categories, dishes, orders, and receipts:

* **Username:** `demo_manager`
* **PIN:** `1234`

You can also click **"Register Restaurant"** on the landing page to register your own custom café with 5-step onboarding!

---

## 📱 Testing the Customer Dine-In QR Experience

Every table has a unique, secure URL:
```text
http://localhost:5173/menu/:restaurantSlug/:qrToken
```

* To test Table 01 directly:
  1. Open [http://localhost:5173](http://localhost:5173) and sign in.
  2. Click **"Tables & QR"** in the sidebar.
  3. Click **"Test Dine-In"** on Table 01 (or click the top bar button **"Open Table 01 Menu"**).
  4. Browse dishes, add to cart, and place an order.
  5. Hear the **repeating "Ting" sound alert** on the manager dashboard and accept the order!

---

## 🗄️ Database & AI Configuration

### Neon PostgreSQL Setup (When ready)
1. Open `server/.env`.
2. Paste your Neon PostgreSQL connection string into `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://username:password@ep-cool-fog-123456.us-east-2.aws.neon.tech/swaadsevak?sslmode=require"
   ```
3. Push the schema to your Neon database:
   ```bash
   npm run prisma:push --prefix server
   ```

### Google Gemini API Setup (When ready)
1. Open `server/.env`.
2. Add your Gemini API Key:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```
* *Note: When no API key is set, Swaad Sevak uses an embedded Indian culinary pattern parser to extract dishes, prices, categories, portions, and veg/non-veg tags from menu PDFs!*

---

## 📦 Key Phase 1 Features

| Feature | Description |
| :--- | :--- |
| **Landing Page** | High-converting SaaS landing page with direct **ROI / Commission Savings Calculator** (showing ₹1.5L+ savings vs 28% aggregator cuts). |
| **5-Step Onboarding** | Restaurant details, Location with Indian states, Interactive table counter `[-] 8 [+]`, and Manager Username + 4-digit PIN creation. |
| **AI Menu PDF Importer** | Drag & drop menu PDF upload with multi-page parsing and **interactive review & edit table** before publishing. |
| **Fast 1-Click Stock Toggle** | 1-click **In-Stock ↔ Out-of-Stock** toggle on manager screen instantly updates active diner phones via WebSockets. |
| **Table QR Management** | Individual high-res branded **PNG card download** and **Download All QRs as ZIP** package. |
| **Live Orders & Sound Alert** | Real-time Kanban stream with **repeating brass bell "ting" sound** synthesized via Web Audio API until acknowledged. |
| **Kitchen Thermal Printing** | Formatted KOT layout for standard **58mm and 80mm** thermal receipt printers. |
| **Customer Bill Request** | Diners tap "Request Bill" on mobile; manager gets real-time notification to generate the bill. |
| **Digital Tax Invoice** | Itemized invoice with GST, payment method settlement (Cash, UPI, Card), and "Powered by Swaad Sevak". |
| **Future-Ready Architecture** | Ready for Capacitor (Manager Mobile/Tablet app), Electron (Desktop POS), and Omnichannel orders (Dine-in, Swiggy, Zomato). |
