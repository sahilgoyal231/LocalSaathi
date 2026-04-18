
---

# **LocalSaathi — Complete Technical Documentation**

**Version:** 1.0  
**Date:** April 17, 2026  
**Project:** LocalSaathi — Local Services Marketplace  
**Stack:** React 19 · Vite · Express · MongoDB · JWT  
**Author:** Project Development Team  

---

> *A comprehensive, file-by-file technical reference covering every logic path, design decision, industry standard, and alternative approach in the LocalSaathi codebase.*

---

## **Table of Contents**

**PART I — UNDERSTANDING THE SYSTEM**

- 1.0 — Project Overview & Architecture
- 2.0 — Quick-Start Setup Guide
- 3.0 — Visual Architecture & Component Hierarchy
- 4.0 — Data Models & Entity Shapes
- 5.0 — State Machine Diagrams
- 6.0 — End-to-End User Journeys
- 7.0 — Cross-File Dependency Map

**PART II — FILE-BY-FILE REFERENCE**

- 8.0 — Entry Points
- 9.0 — State Management — Context Layer
- 10.0 — Reusable Components
- 11.0 — Pages — Authentication
- 12.0 — Pages — Dashboard Layer
- 13.0 — Pages — Service Booking Flow
- 14.0 — Pages — Material Request Flow
- 15.0 — Pages — Skill Verification
- 16.0 — Pages — Profile Management
- 17.0 — Pages — Admin Panel

**PART III — SUPPORTING SYSTEMS**

- 18.0 — CSS Design System
- 19.0 — CSS File Documentation
- 20.0 — Utility Modules
- 21.0 — Quiz Question Bank
- 22.0 — Backend — Server
- 23.0 — REST API Reference
- 24.0 — Security Architecture
- 25.0 — Error Handling Patterns
- 26.0 — Glossary of Terms
- 27.0 — Industry Standards Summary

---
---

# **PART I — UNDERSTANDING THE SYSTEM**

---

## **1.0 — Project Overview & Architecture**

### **1.1 — What is LocalSaathi?**

**LocalSaathi** is a tri-role local services marketplace built as a full-stack JavaScript application. It connects three types of users in a local economy:

| **Role**         | **Purpose**                                          | **Key Actions**                                                            |
|:-----------------|:-----------------------------------------------------|:---------------------------------------------------------------------------|
| **Customer**     | Books services and requests materials                | Create bookings, compare proposals, accept quotations, leave feedback      |
| **Serviceman**   | Offers professional services                         | Pass skill quiz, browse job board, propose rates, complete jobs with proof  |
| **Shopkeeper**   | Supplies building materials                          | View leads, create quotations (manual or image), fulfill orders            |

In addition, an **Admin** role exists for platform oversight — verifying servicemen, managing users, and viewing statistics.

---

### **1.2 — Technology Stack**

| **Layer**      | **Technology**                   | **Version**   | **Why This Choice**                                        |
|:---------------|:---------------------------------|:--------------|:-----------------------------------------------------------|
| Frontend       | React + Vite                     | 19 / 6.x      | Fastest HMR, ESM-native bundling, concurrent rendering     |
| Routing        | react-router-dom                 | v7             | Declarative, nested routing with layout routes              |
| State          | Context API + localStorage       | —              | Sufficient for demo-scale, zero external dependencies       |
| Icons          | lucide-react                     | latest         | Tree-shakeable, consistent 1000+ icon set                   |
| Styling        | Vanilla CSS + CSS Variables      | —              | Full design control, no framework lock-in                    |
| Backend        | Express + MongoDB                | 5 / Mongoose 9 | Industry standard REST + document DB                        |
| Auth           | JWT + bcrypt                     | —              | Stateless tokens + secure password hashing                   |
| Security       | Helmet + rate-limit + sanitize-html | —           | OWASP-recommended middleware stack                           |

---

### **1.3 — Dual Operating Mode**

The frontend operates in **two modes**:

- **Demo Mode** (localStorage-only, no backend needed) — used by Customers and Shopkeepers
- **Backend Mode** (full MongoDB-backed auth) — used by Servicemen (quiz attempts must be tracked server-side)

The `demo-token` mechanism in `AuthContext` enables this dual operation. When a user's token value is the literal string `'demo-token'`, all persistence operations use localStorage instead of the backend API.

---

### **1.4 — Directory Structure**

```
service-hub/
│
├── src/
│   ├── main.jsx                     # React entry point
│   ├── App.jsx                      # Router + layout + auth guards
│   ├── index.css                    # Global design tokens
│   │
│   ├── context/
│   │   ├── AuthContext.jsx          # Authentication state management
│   │   └── DataContext.jsx          # Business logic state management
│   │
│   ├── components/
│   │   ├── Navbar.jsx               # Global navigation + i18n selector
│   │   ├── Navbar.css               # Navbar styles
│   │   ├── NotificationDropdown.jsx # Notification panel
│   │   ├── AnimatedBackground.jsx   # Parallax floating icons
│   │   ├── LoadingPage.jsx          # Splash screen
│   │   ├── LoadingPage.css          # Splash screen styles
│   │   ├── PageTransition.jsx       # Route change animation
│   │   └── AdminRoute.jsx          # Admin-only route guard
│   │
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   ├── Dashboard.jsx            # Role-based router
│   │   ├── CustomerDashboard.jsx    # Customer home
│   │   ├── ServicemanDashboard.jsx  # Serviceman home
│   │   ├── ShopkeeperDashboard.jsx  # Shopkeeper home
│   │   ├── BookService.jsx          # Service booking form
│   │   ├── RequestMaterial.jsx      # Material request form
│   │   ├── SkillQuiz.jsx            # Skill verification quiz (with TTS)
│   │   ├── JobDetails.jsx           # Job completion page
│   │   ├── LeadDetails.jsx          # Quotation creation page
│   │   ├── RequestDetails.jsx       # Quotation comparison page
│   │   ├── FeedbackPage.jsx         # Service feedback form
│   │   ├── OrderFeedbackPage.jsx    # Order feedback form
│   │   ├── CustomerProfile.jsx      # Customer profile editor
│   │   ├── ServicemanProfile.jsx    # Serviceman profile editor
│   │   ├── ShopkeeperProfile.jsx    # Shopkeeper profile editor
│   │   └── admin/
│   │       ├── AdminDashboard.jsx   # Admin statistics
│   │       └── ManageUsers.jsx      # User management
│   │
│   ├── utils/
│   │   ├── translations.js          # 12 Indian languages
│   │   ├── serviceThemes.js         # 10 service category themes
│   │   └── ratingColors.js          # Rating color logic
│   │
│   ├── data/
│   │   ├── quizQuestions.js         # Quiz question bank (2.6 MB)
│   │   └── questions/               # Question index module
│   │
│   ├── styles/
│   │   └── Auth.css                 # Auth page styles
│   │
│   └── assets/
│       └── logo.png                 # Brand logo
│
├── server/
│   ├── index.js                     # Express entry point
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verify + role check
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── QuizAttempt.js           # Quiz attempt tracker
│   ├── routes/
│   │   ├── authRoutes.js            # Auth API endpoints
│   │   └── adminRoutes.js           # Admin API endpoints
│   ├── data/
│   │   └── users.js                 # Seed data
│   ├── seeder.js                    # Database seeder script
│   ├── createAdmin.js               # Admin account creator
│   └── package.json                 # Server dependencies
│
├── package.json                     # Frontend dependencies
└── vite.config.js                   # Vite configuration
```

---
---

## **2.0 — Quick-Start Setup Guide**

### **2.1 — Prerequisites**

- **Node.js** version 18.x or higher
- **MongoDB** (only needed for serviceman registration and quiz tracking)
- **npm** version 9.x or higher

---

### **2.2 — Installation Steps**

**Step 1 — Install Frontend Dependencies:**

```bash
cd service-hub
npm install
```

**Step 2 — Install Backend Dependencies (optional — only for serviceman flow):**

```bash
cd server
npm install
```

**Step 3 — Environment Configuration:**

Create a file named `.env` inside `service-hub/server/`:

```
MONGO_URI=mongodb://localhost:27017/localsaathi
JWT_SECRET=your_secret_key_here
PORT=5001
```

**Step 4 — Run the Application:**

```bash
# From service-hub/ root — starts BOTH frontend and backend
npm run dev

# OR run separately:
# Frontend only (demo mode — no backend needed):
npx vite

# Backend only:
cd server && npm run server
```

**Step 5 — Access the Application:**

| **Service**     | **URL**                          | **Notes**                |
|:----------------|:---------------------------------|:-------------------------|
| Frontend        | `http://localhost:5173`           | Vite dev server          |
| Backend API     | `http://localhost:5001`           | Express server           |
| Admin Panel     | `http://localhost:5173/admin`     | Login as admin first     |

---

### **2.3 — Demo Login Credentials**

| **Role**       | **Email**                | **Password**       |
|:---------------|:-------------------------|:-------------------|
| Customer       | `ram@demo.com`           | `123456`           |
| Shopkeeper     | `shop@demo.com`          | `123456`           |
| Serviceman     | `electrician@demo.com`   | `123456`           |
| Admin          | `admin@localsaathi.com`  | `SecureAdmin123!`  |

---

### **2.4 — Seed Demo Data (Optional)**

```bash
cd server
node seeder.js          # Import 19 test users
node createAdmin.js     # Create/reset admin account
```

---
---

## **3.0 — Visual Architecture & Component Hierarchy**

### **3.1 — High-Level System Architecture**

The system is divided into three tiers:

```
┌────────────────────────────────────────────────────────────────────┐
│                     BROWSER (React SPA)                            │
│                                                                    │
│   ┌──────────────────┐   ┌──────────────────┐                     │
│   │   AuthContext     │   │   DataContext     │                     │
│   │  ─ user state     │   │  ─ bookings      │                     │
│   │  ─ login/logout   │   │  ─ requests      │                     │
│   │  ─ register       │   │  ─ quotations    │                     │
│   │  ─ updateProfile  │   │  ─ notifications │                     │
│   └────────┬─────────┘   │  ─ language       │                     │
│            │              └────────┬─────────┘                     │
│            │                       │                                │
│            ▼                       ▼                                │
│   ┌────────────────────────────────────────────┐                   │
│   │              localStorage                   │                   │
│   │  ─ user (JSON)                              │                   │
│   │  ─ bookings (JSON)                          │                   │
│   │  ─ requests (JSON)                          │                   │
│   │  ─ quotations (JSON)                        │                   │
│   │  ─ notifications (JSON)                     │                   │
│   └────────────────────────────────────────────┘                   │
└────────────────────────────────────────────────────────────────────┘
         │ (Only for serviceman auth + admin routes)
         ▼
┌────────────────────────────────────────────────────────────────────┐
│                     SERVER (Express)                               │
│                                                                    │
│   Middleware Chain:                                                 │
│   express.json → CORS → Helmet → Sanitizer → Rate Limiter         │
│                                                                    │
│   Routes:                                                          │
│   /api/auth/register   → Auth Routes (public)                     │
│   /api/auth/login      → Auth Routes (public)                     │
│   /api/auth/profile    → Auth Routes (JWT protected)              │
│   /api/admin/stats     → Admin Routes (JWT + admin role)          │
│   /api/admin/users     → Admin Routes (JWT + admin role)          │
│   /api/admin/verify/:id → Admin Routes (JWT + admin role)         │
│   /api/admin/user/:id  → Admin Routes (JWT + admin role)          │
└────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                             │
│                                                                    │
│   Collections:                                                     │
│   ├── users         (User model — all roles)                      │
│   └── quizattempts  (QuizAttempt model — attempt tracking)        │
└────────────────────────────────────────────────────────────────────┘
```

---

### **3.2 — Component Hierarchy Tree**

```
main.jsx
└── <StrictMode>
    └── <App>
        └── <BrowserRouter>
            └── <AuthProvider>
                └── <DataProvider>
                    │
                    ├── [IF NOT READY] ─── <LoadingPage />
                    │
                    └── [IF READY]
                        ├── <Navbar>
                        │   ├── Language Selector (Globe + <select>)
                        │   ├── <NotificationDropdown />
                        │   └── Profile Chip / Auth Buttons
                        │
                        ├── PUBLIC ROUTES
                        │   ├── /login       → <Login />
                        │   └── /register    → <Register />
                        │
                        ├── PRIVATE ROUTES (wrapped in <PrivateRoute> + <PageTransition>)
                        │   ├── /dashboard   → <Dashboard> (role router)
                        │   │                   ├── customer    → <CustomerDashboard />
                        │   │                   ├── serviceman  → <ServicemanDashboard />
                        │   │                   │                  (or → <SkillQuiz /> if !verified)
                        │   │                   └── shopkeeper  → <ShopkeeperDashboard />
                        │   │
                        │   ├── /book-service      → <BookService />
                        │   ├── /request-material  → <RequestMaterial />
                        │   ├── /skill-quiz        → <SkillQuiz />
                        │   ├── /job/:id           → <JobDetails />
                        │   ├── /lead/:id          → <LeadDetails />
                        │   ├── /request/:id       → <RequestDetails />
                        │   ├── /feedback/:id      → <FeedbackPage />
                        │   ├── /order-feedback/:id → <OrderFeedbackPage />
                        │   ├── /profile           → <CustomerProfile />
                        │   ├── /serviceman-profile → <ServicemanProfile />
                        │   └── /shopkeeper-profile → <ShopkeeperProfile />
                        │
                        └── ADMIN ROUTES (wrapped in <AdminRoute>)
                            ├── /admin       → <AdminDashboard />
                            └── /admin/users → <ManageUsers />
```

---

### **3.3 — Data Flow Between Roles**

**Service Booking Flow:**

```
CUSTOMER                    DATA CONTEXT                    SERVICEMAN
───────                     ────────────                    ──────────
1. Creates booking    ────► addBooking()
                            bookings[] updated      ────►  2. Sees job on board
                                                           3. Proposes rate/time
                      ◄──── expressInterest()       ◄────
4. Sees provider cards
5. Clicks "Hire Pro"  ────► hireProvider()
                            status → accepted       ────►  6. Sees accepted job
                                                           7. Completes + uploads proof
                      ◄──── updateBookingStatus()   ◄────
8. Sees "Leave Feedback"
9. Submits rating     ────► addBookingFeedback()
```

**Material Request Flow:**

```
CUSTOMER                    DATA CONTEXT                    SHOPKEEPER
───────                     ────────────                    ──────────
1. Submits request    ────► addRequest()
                            requests[] updated      ────►  2. Sees lead
                                                           3. Creates quotation
                      ◄──── addQuotation()          ◄────
4. Sees quotation cards
5. Accepts quotation  ────► acceptQuotation()
                            request → closed
                            quotation → accepted    ────►  6. Sees order confirmed
                                                           7. Fulfills order
                      ◄──── completeOrder()         ◄────
8. Leaves feedback    ────► addOrderFeedback()
```

---
---

## **4.0 — Data Models & Entity Shapes**

Every piece of business data in the frontend flows through `DataContext.jsx`. Below are the **exact shapes** of each entity as they exist in state and localStorage.

---

### **4.1 — Booking Object**

```javascript
{
    id: "BK-1711929600000",          // Prefixed timestamp ID
    userId: "1711929500000",          // Customer who created the booking
    serviceCategory: "Electrician",   // From serviceThemes keys
    description: "Fix ceiling fan",
    address: "123 Main St",
    preferredDate: "2026-04-20",
    preferredTime: "10:00",
    isContract: false,                // true = multi-day contract
    contractDays: 1,                  // Number of days (minimum 2 if contract)
    status: "pending",                // State: pending → accepted → completed
    date: "2026-04-17T12:00:00.000Z", // Creation timestamp (ISO 8601)

    interestedProviders: [            // Array of serviceman proposals
        {
            id: "sm-001",
            name: "Rajesh Kumar",
            skills: "Electrician",
            experience: 5,
            rating: 4.2,
            proposedRate: "500",      // ₹ per day (string)
            proposedTime: "3"         // hours per day (string)
        }
    ],

    // ── Fields set after hiring ──
    servicemanId: "sm-001",           // ID of the hired provider
    agreedPrice: 500,                 // proposedRate × contractDays

    // ── Fields set after feedback ──
    feedback: {
        rating: 4,                    // 1–5 stars
        comment: "Great work!",
        rewardEarned: 5               // Points earned by customer
    }
}
```

---

### **4.2 — Request Object (Material)**

```javascript
{
    id: "1711929600000",
    userId: "cust-001",               // Customer who created the request
    category: "cement",               // Material category
    description: "Need 50 bags of OPC 53 grade cement",
    quantity: "50 bags",
    image: "data:image/png;base64,...", // Optional reference image (base64)
    status: "open",                   // State: open → closed
    date: "2026-04-17T12:00:00.000Z"  // Creation timestamp
}
```

---

### **4.3 — Quotation Object**

```javascript
{
    id: "1711929700000",
    requestId: "1711929600000",       // Links to parent Request
    shopkeeperId: "shop-001",
    shopkeeperName: "Kumar Hardware",

    // ── Manual quotation mode ──
    items: [
        { name: "OPC 53 Cement", qty: 50, price: 380, total: 19000 },
        { name: "Delivery", qty: 1, price: 500, total: 500 }
    ],

    // ── OR Image quotation mode ──
    quotationImage: "data:image/png;base64,...",

    totalAmount: 19500,
    deliveryCharge: 500,
    terms: "Payment on delivery",
    validity: "7 days",
    status: "sent",                   // State: sent → accepted → completed
    date: "2026-04-17T12:30:00.000Z",

    // ── Fields set after feedback ──
    feedback: {
        rating: 5,
        comment: "Fast delivery",
        rewardEarned: 8
    }
}
```

---

### **4.4 — Notification Object**

```javascript
{
    id: "1711929800000",
    userId: "cust-001",               // Target user (null = broadcast to all)
    message: "Rajesh Kumar is interested in your Electrician request!",
    type: "info",                     // info | success | warning | error
    read: false,
    date: "2026-04-17T12:45:00.000Z"
}
```

---

### **4.5 — User Object (Frontend — stored in AuthContext/localStorage)**

```javascript
{
    id: "cust-001",                   // Date.now() for demo, MongoDB _id for backend
    name: "Ram Kumar",
    email: "ram@demo.com",
    contact: "9876543210",
    role: "customer",                 // customer | serviceman | shopkeeper | admin
    token: "demo-token",             // "demo-token" or real JWT string

    // ── Serviceman-specific fields ──
    skills: "Electrician",
    experience: 5,
    skillVerified: true,
    quizScore: 4,
    rates: "500",
    serviceArea: "10 km",
    availability: "Mon-Sat",
    rating: 4.2,

    // ── Shopkeeper-specific fields ──
    shopName: "Kumar Hardware",
    businessRegistration: "GST123",
    deliveryRadius: "15 km",

    // ── Common fields ──
    address: "123 Main St",
    rewardPoints: 45
}
```

---

### **4.6 — User Model (Backend — MongoDB Schema)**

```javascript
{
    _id: ObjectId("..."),             // MongoDB auto-generated
    name: String,                     // required
    email: String,                    // sparse + unique
    contact: String,                  // sparse + unique
    password: String,                 // bcrypt hashed, required
    role: String,                     // enum: user|customer|serviceman|admin|shopkeeper
    serviceType: String,              // required only if role === 'serviceman'
    experience: Number,
    isVerified: Boolean,              // Admin verification flag (default: false)
    skills: String,
    rates: String,
    serviceArea: String,
    availability: String,
    address: String,
    shopName: String,
    shopAddress: String,
    businessRegistration: String,
    deliveryRadius: String,
    rewardPoints: Number,             // default: 0
    quizScore: Number,                // default: 0
    skillVerified: Boolean,           // Quiz pass flag (default: false)
    rating: Number,                   // default: 0.0
    createdAt: Date                   // default: Date.now
}
```

---

### **4.7 — QuizAttempt Model (Backend — MongoDB Schema)**

```javascript
{
    _id: ObjectId("..."),
    identifier: String,               // User's email or phone
    profile: String,                  // Skill category (e.g., "Electrician")
    attempts: Number,                 // default: 0, max enforced at 3
    createdAt: Date,                  // auto (timestamps: true)
    updatedAt: Date                   // auto (timestamps: true)
}
// Compound unique index: { identifier: 1, profile: 1 }
```

---
---

## **5.0 — State Machine Diagrams**

### **5.1 — Booking Lifecycle**

```
                    Customer creates booking
                    (BookService.jsx → addBooking)
                              │
                              ▼
                     ┌─────────────────┐
                     │    PENDING       │◄──────────────────────────┐
                     │                  │   Serviceman bids again   │
                     │ interestedPro-   │   (expressInterest)       │
                     │ viders[] grows   │───────────────────────────┘
                     └────────┬────────┘
                              │ Customer hires a provider
                              │ (CustomerDashboard → hireProvider)
                              ▼
                     ┌─────────────────┐
                     │    ACCEPTED      │
                     │                  │
                     │ servicemanId set │
                     │ agreedPrice calc │
                     │ other bids clear │
                     └────────┬────────┘
                              │ Serviceman uploads proof + marks done
                              │ (JobDetails → updateBookingStatus)
                              ▼
                     ┌─────────────────┐
                     │    COMPLETED     │
                     │                  │
                     │ Customer leaves  │
                     │ feedback + earns │
                     │ reward points    │
                     └─────────────────┘
```

---

### **5.2 — Material Request Lifecycle**

```
                    Customer submits request
                    (RequestMaterial → addRequest)
                              │
                              ▼
                     ┌─────────────────┐
                     │      OPEN        │◄──────────────────────────┐
                     │                  │   More shopkeepers send   │
                     │ Multiple quotes  │   quotations              │
                     │ can arrive       │───────────────────────────┘
                     └────────┬────────┘
                              │ Customer accepts a quotation
                              │ (RequestDetails → acceptQuotation)
                              ▼
                     ┌─────────────────┐
                     │     CLOSED       │
                     │                  │
                     │ Accepted quote   │
                     │ moves to its own │
                     │ lifecycle below  │
                     └─────────────────┘
```

---

### **5.3 — Quotation Lifecycle**

```
                    Shopkeeper creates quotation
                    (LeadDetails → addQuotation)
                              │
                              ▼
                     ┌─────────────────┐
                     │      SENT        │
                     │                  │
                     │ Waiting for      │
                     │ customer to      │
                     │ review           │
                     └────────┬────────┘
                              │ Customer accepts this quote
                              │ (RequestDetails → acceptQuotation)
                              ▼
                     ┌─────────────────┐
                     │    ACCEPTED      │
                     │                  │
                     │ Parent request   │
                     │ → closed         │
                     │ Notification     │
                     │ sent to shop     │
                     └────────┬────────┘
                              │ Shopkeeper marks order fulfilled
                              │ (ShopkeeperDashboard → completeOrder)
                              ▼
                     ┌─────────────────┐
                     │    COMPLETED     │
                     │                  │
                     │ Customer leaves  │
                     │ order feedback   │
                     │ + earns rewards  │
                     └─────────────────┘
```

---

### **5.4 — Serviceman Verification Lifecycle**

```
                    Serviceman registers
                    (Register.jsx → backend)
                              │
                              ▼
                     ┌─────────────────┐
                     │   REGISTERED     │
                     │  (unverified)    │
                     └────────┬────────┘
                              │ Auto-redirect to SkillQuiz
                              │ (Dashboard.jsx guard)
                              ▼
                     ┌─────────────────┐
                     │  TAKING QUIZ     │
                     │  (5 questions)   │
                     └──┬──────────┬───┘
                        │          │
              Score ≥ 4/5      Score < 4/5
                        │          │
                        ▼          ▼
               ┌──────────┐  ┌──────────────┐
               │ VERIFIED  │  │   FAILED      │
               │           │  │               │
               │ Can access │  │ Attempt count │
               │ dashboard  │  │ incremented   │
               │ + jobs     │  │ on server     │
               └─────┬─────┘  └───┬───────┬───┘
                     │            │       │
            Profile updated   < 3 fails  ≥ 3 fails
            (any field)          │       │
                     │           ▼       ▼
                     │     Can retry   ┌──────────┐
                     └───► TAKING QUIZ │ BLOCKED   │
                                       │ (permanent│
                                       │ per skill)│
                                       └──────────┘
```

---
---

## **6.0 — End-to-End User Journeys**

### **6.1 — Customer Journey: Booking an Electrician**

| **Step** | **User Action**                   | **File(s) Involved**                                    | **State Change**                                           |
|:---------|:----------------------------------|:--------------------------------------------------------|:-----------------------------------------------------------|
| 1        | Click "Find Pro" on dashboard     | `CustomerDashboard.jsx` → `<Link to="/book-service">`  | Navigate to booking form                                   |
| 2        | Select "Electrician" card         | `BookService.jsx` → `selectService()`                    | `formData.serviceCategory = 'Electrician'`                 |
| 3        | Fill description, date, time      | `BookService.jsx` → `handleChange()`                     | `formData` fields updated                                  |
| 4        | Submit form                       | `BookService.jsx` → `DataContext.addBooking()`           | New booking in `bookings[]` with `status: 'pending'`       |
| 5        | *(Wait for serviceman)*           | `ServicemanDashboard.jsx` — electricians see this job    | —                                                          |
| 6        | Serviceman proposes rate          | `ServicemanDashboard` → `DataContext.expressInterest()`  | `booking.interestedProviders` grows                        |
| 7        | Customer sees proposal cards      | `CustomerDashboard.jsx` — provider comparison section    | Read from `bookings.interestedProviders`                   |
| 8        | Click "Hire Pro"                  | `CustomerDashboard` → `DataContext.hireProvider()`       | `status → 'accepted'`, `agreedPrice` calculated            |
| 9        | *(Serviceman completes work)*     | `JobDetails.jsx` → uploads proof → `updateBookingStatus` | `status → 'completed'`                                    |
| 10       | Customer clicks "Leave Feedback"  | `CustomerDashboard` → `<Link to="/feedback/{id}">`      | Navigate to feedback form                                  |
| 11       | Submit rating + comment           | `FeedbackPage.jsx` → `addBookingFeedback()`, `updateProfile()` | `booking.feedback` set, `user.rewardPoints` updated  |

---

### **6.2 — Material Request Journey: Customer → Shopkeeper**

| **Step** | **User Action**                   | **File(s) Involved**                                    | **State Change**                                           |
|:---------|:----------------------------------|:--------------------------------------------------------|:-----------------------------------------------------------|
| 1        | Click "Start Request"             | `CustomerDashboard` → `<Link to="/request-material">`   | Navigate to request form                                   |
| 2        | Fill category, quantity, upload   | `RequestMaterial.jsx` → `handleImageChange()` (FileReader)| `formData` + `imageStr` (base64 string)                   |
| 3        | Submit request                    | `RequestMaterial` → `DataContext.addRequest()`           | New request in `requests[]` with `status: 'open'`          |
| 4        | *(Shopkeeper sees lead)*          | `ShopkeeperDashboard.jsx` — filters open requests       | —                                                          |
| 5        | Shopkeeper opens lead             | `ShopkeeperDashboard` → `<Link to="/lead/{id}">`        | Navigate to quotation form                                 |
| 6        | Creates quotation (manual/image)  | `LeadDetails.jsx` → `DataContext.addQuotation()`         | New quotation with `status: 'sent'`                        |
| 7        | Customer views quotations         | `CustomerDashboard` → `<Link to="/request/{id}">`       | Navigate to comparison page                                |
| 8        | Accepts a quotation               | `RequestDetails.jsx` → `DataContext.acceptQuotation()`   | Quotation → `'accepted'`, Request → `'closed'`, notified  |
| 9        | Shopkeeper fulfills order         | `ShopkeeperDashboard` → `DataContext.completeOrder()`    | Quotation → `'completed'`, customer notified               |
| 10       | Customer leaves feedback          | `OrderFeedbackPage.jsx` → `addOrderFeedback()`          | `quotation.feedback` set, rewards calculated               |

---

### **6.3 — Serviceman Journey: Registration → First Job**

| **Step** | **Action**                        | **File(s) Involved**                                    | **Key Logic**                                              |
|:---------|:----------------------------------|:--------------------------------------------------------|:-----------------------------------------------------------|
| 1        | Select "Serviceman" role          | `Register.jsx`                                           | Shows visual skill selector + experience field             |
| 2        | Pick skill (e.g., Plumber)        | `Register.jsx` → `selectSkill()`                         | `formData.skills = 'Plumber'`                              |
| 3        | Submit registration               | `Register.jsx` → `AuthContext.register()` → backend      | Server checks quiz attempts < 3, creates user              |
| 4        | Auto-redirect to quiz             | `Register.jsx` → `navigate('/skill-quiz')`               | —                                                          |
| 5        | Answer 5 random questions         | `SkillQuiz.jsx`                                          | Two-phase loading: indices then language hydration          |
| 6a       | Pass (≥ 4/5)                      | `SkillQuiz` → `updateProfile({ skillVerified: true })`   | Navigate to dashboard                                     |
| 6b       | Fail (< 4/5)                      | `SkillQuiz` → `updateProfile({ skillVerified: false })`  | Server increments attempts, user logged out                |
| 7        | See Job Board                     | `ServicemanDashboard.jsx`                                | Filters: pending + my skill + not already bid              |
| 8        | Express interest                  | `ServicemanDashboard` → `DataContext.expressInterest()`  | Provider added to `booking.interestedProviders`            |
| 9        | Get hired                         | *(Customer clicks "Hire Pro")*                           | `booking.servicemanId = user.id`, status → `'accepted'`   |
| 10       | Complete job                      | `JobDetails.jsx` → upload proof → `updateBookingStatus`  | Must upload image before marking complete                  |

---
---

## **7.0 — Cross-File Dependency Map**

### **7.1 — What Each Page Imports**

| **Page**               | **AuthContext** | **DataContext** | **translations** | **serviceThemes** | **ratingColors** | **Other**        |
|:-----------------------|:---------------:|:---------------:|:----------------:|:-----------------:|:----------------:|:-----------------|
| Login                  | ✓               | ✓ (lang)        | ✓                | —                 | —                | Auth.css, logo   |
| Register               | ✓               | ✓ (lang)        | ✓                | ✓                 | —                | Auth.css, logo   |
| Dashboard              | ✓               | —               | —                | —                 | —                | Sub-dashboards   |
| CustomerDashboard      | ✓               | ✓ (all)         | ✓                | —                 | ✓                | —                |
| ServicemanDashboard    | ✓               | ✓ (all)         | ✓                | ✓                 | ✓                | AnimatedBG       |
| ShopkeeperDashboard    | ✓               | ✓ (all)         | ✓                | —                 | ✓                | —                |
| BookService            | ✓               | ✓               | ✓                | ✓                 | —                | AnimatedBG       |
| SkillQuiz              | ✓               | ✓ (lang)        | ✓                | —                 | —                | quizQuestions    |
| RequestMaterial        | ✓               | ✓               | ✓                | —                 | —                | logo (fallback)  |
| LeadDetails            | ✓               | ✓               | —                | —                 | —                | —                |
| RequestDetails         | ✓               | ✓               | —                | —                 | —                | —                |
| JobDetails             | ✓               | ✓               | —                | —                 | —                | —                |
| FeedbackPage           | ✓               | ✓               | —                | —                 | —                | —                |
| OrderFeedbackPage      | ✓               | ✓               | —                | —                 | —                | —                |
| CustomerProfile        | ✓               | ✓ (lang)        | ✓                | —                 | —                | —                |
| ServicemanProfile      | ✓               | ✓               | ✓                | ✓                 | ✓                | AnimatedBG       |
| ShopkeeperProfile      | ✓               | ✓ (lang)        | ✓                | —                 | —                | —                |
| AdminDashboard         | ✓               | —               | —                | —                 | —                | Backend API      |
| ManageUsers            | ✓               | —               | —                | —                 | —                | Backend API      |

---

### **7.2 — Context Provider API Surface**

**AuthContext exports:**

| **Export**         | **Type**     | **Used By**                              |
|:-------------------|:-------------|:-----------------------------------------|
| `user`             | Object/null  | Every page/component                     |
| `loading`          | boolean      | AdminRoute, PrivateRoute                 |
| `login()`          | async fn     | Login.jsx                                |
| `register()`       | async fn     | Register.jsx                             |
| `logout()`         | fn           | Navbar, SkillQuiz (on failure)           |
| `updateProfile()`  | async fn     | All profile pages, SkillQuiz, FeedbackPage |

**DataContext exports:**

| **Export**             | **Type**   | **Used By**                                     |
|:-----------------------|:-----------|:------------------------------------------------|
| `bookings`             | Array      | CustomerDashboard, ServicemanDashboard, etc.    |
| `requests`             | Array      | CustomerDashboard, ShopkeeperDashboard          |
| `quotations`           | Array      | LeadDetails, RequestDetails, ShopkeeperDashboard |
| `notifications`        | Array      | Navbar, NotificationDropdown                    |
| `addBooking()`         | fn         | BookService                                     |
| `expressInterest()`    | fn         | ServicemanDashboard                             |
| `hireProvider()`       | fn         | CustomerDashboard                               |
| `updateBookingStatus()`| fn         | JobDetails                                      |
| `addBookingFeedback()` | fn         | FeedbackPage                                    |
| `addRequest()`         | fn         | RequestMaterial                                 |
| `addQuotation()`       | fn         | LeadDetails                                     |
| `acceptQuotation()`    | fn         | RequestDetails                                  |
| `completeOrder()`      | fn         | ShopkeeperDashboard                             |
| `addOrderFeedback()`   | fn         | OrderFeedbackPage                               |
| `addNotification()`    | fn         | Internal (used by other DataContext functions)  |
| `markNotificationRead()`| fn        | NotificationDropdown                            |
| `getProviderRating()`  | fn         | ServicemanDashboard, CustomerDashboard          |
| `getShopkeeperRating()`| fn         | ShopkeeperDashboard                             |
| `getShopkeeperPoints()`| fn         | ShopkeeperDashboard                             |
| `language`             | string     | All pages (via `translations[language]`)        |
| `changeLanguage()`     | fn         | Navbar                                          |

---
---

# **PART II — FILE-BY-FILE REFERENCE**

---

## **8.0 — Entry Points**

### **8.1 — `main.jsx`**

**File path:** `src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**What:** The JavaScript entry point that bootstraps the entire React application.

**Why each element matters:**

| **Element**           | **Purpose**                                            | **What if removed or changed?**                                      |
|:----------------------|:-------------------------------------------------------|:---------------------------------------------------------------------|
| `StrictMode`          | Double-invokes renders in dev to catch impure components| Bugs from side-effect-dependent renders would go unnoticed           |
| `createRoot`          | React 18+ concurrent rendering API                     | Using legacy `ReactDOM.render()` disables automatic batching         |
| `import './index.css'`| Side-effect CSS import; Vite injects into `<head>`     | No design tokens, no base styles — raw browser defaults              |

**Industry Standard:** `createRoot` is mandatory for concurrent features like `useTransition` and `useDeferredValue`. `StrictMode` has zero production cost — it's automatically stripped in release builds.

---

### **8.2 — `App.jsx` — The Architectural Core**

**File path:** `src/App.jsx`

This is the most architecturally significant file in the frontend. It handles routing, authentication guards, loading orchestration, and layout composition.

---

**8.2.1 — Provider Composition Order:**

```jsx
<BrowserRouter>
  <AuthProvider>
    <DataProvider>
      {/* app content */}
    </DataProvider>
  </AuthProvider>
</BrowserRouter>
```

**Why this exact order matters:**

1. `BrowserRouter` must be outermost because `AuthProvider` and `DataProvider` may use `useNavigate` (React Router hooks require Router context above them).
2. `AuthProvider` must wrap `DataProvider` because `DataProvider` needs access to the `user` object from `AuthContext` (data operations depend on knowing *who* is logged in).

**What if the order was different?**

- `DataProvider` outside `AuthProvider`: Any `useAuth()` call inside `DataProvider` would throw a "context not found" error.
- `BrowserRouter` inside `AuthProvider`: Any routing hooks (`useNavigate`) used in `AuthProvider` would crash.

**Industry Standard:** This nested provider pattern is the canonical way to compose context in React. The ordering principle — dependencies must be ancestors — is universal across all React applications.

---

**8.2.2 — Loading Orchestration:**

```jsx
const [isAppReady, setIsAppReady] = useState(false);

useEffect(() => {
    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 3500));
    const actualLoad = new Promise((resolve) => setTimeout(resolve, 100));

    Promise.all([minimumDelay, actualLoad]).then(() => {
        setIsAppReady(true);
    });
}, []);
```

**What:** Forces a minimum 3.5-second loading screen before showing the app.

**Why:** This is a deliberate UX decision. The loading animation (pulsing ring, gradient text, progress bar) creates a **perceived quality** impression. Apps like Spotify, Slack, and Bloomberg employ similar "branded loading" screens.

**How `Promise.all` works here:**

- `minimumDelay` — A 3500ms timer (minimum splash duration).
- `actualLoad` — A 100ms timer (simulated data load).
- `Promise.all` waits for **both** to complete. Since `minimumDelay` is always longer, it effectively controls the minimum display time.
- The pattern is **extensible**: you can add real API prefetching as a third promise without restructuring.

**Industry Standard:** Google's Material Design guidelines recommend skeleton screens for at least 500ms. Apple's HIG recommends branded launch screens. The 3.5s in this project is on the longer side — most production apps use 1–2 seconds.

---

**8.2.3 — PrivateRoute — Authentication Guard:**

```jsx
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
};
```

**What:** A Higher-Order Component (HOC) that protects routes from unauthenticated access.

**Why:** Without this, any user could type `/dashboard` in the URL bar and access protected content. This is a **client-side guard** — it prevents UI access but does not protect API data (that's the server's job via `authMiddleware`).

**Why `replace`?** Without it, the protected route remains in the browser history. If the user logged in, pressing Back would return to the protected page, which would redirect to login again — creating an infinite redirect loop.

**Industry Standard Alternative — Route-level guards (react-router v6.4+):**

```jsx
const router = createBrowserRouter([
    {
        path: '/dashboard',
        loader: async () => {
            const user = getUser();
            if (!user) throw redirect('/login');
            return user;
        },
        element: <Dashboard />
    }
]);
```

This data-router approach allows auth checks *before* the component renders. LocalSaathi uses the component-based approach, which is equally valid and more readable.

---

**8.2.4 — Route Nesting Pattern:**

```jsx
<Route path="/dashboard" element={
    <PrivateRoute><PageTransition><Dashboard /></PageTransition></PrivateRoute>
} />
```

Every protected route follows this nesting: **PrivateRoute → PageTransition → PageComponent**.

- `PrivateRoute` — Ensures the user is authenticated
- `PageTransition` — Adds the fade-in/slide-up animation on route change
- `PageComponent` — The actual page

**Why `PageTransition` is inside `PrivateRoute`:** If it were outside, the animation would play during the redirect to `/login`, creating a brief flash before the login page appears.

---
---

## **9.0 — State Management — Context Layer**

### **9.1 — `AuthContext.jsx` — Authentication Nucleus**

**File path:** `src/context/AuthContext.jsx`

This file manages login, registration, logout, profile updates, and automatic session restoration.

---

**9.1.1 — Token Duality: Demo vs. Backend**

The entire auth system operates in two modes, discriminated by the token value `'demo-token'`:

```jsx
const login = async (identifier, password) => {
    // MODE 1: Check demo users first (offline-capable)
    const demoMatch = demoUsers.find(
        u => (u.email === identifier || u.contact === identifier) && u.password === password
    );
    if (demoMatch) {
        const userData = { ...demoMatch, token: 'demo-token', id: demoMatch.id };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
    }

    // MODE 2: Backend API (required for servicemen)
    const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
    });
    // ...
```

**What:** The login function first checks a local array of demo users. Only if no match is found does it make a network request to the backend.

**Why:** This enables the app to work **completely offline** for demonstration. When presenting at conferences, hackathons, or classrooms, you don't need a MongoDB instance running.

**How the duality cascades into other functions:**

```jsx
const updateProfile = async (updates) => {
    if (user.token === 'demo-token') {
        // Demo mode: merge into localStorage
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
    }

    // Backend mode: PUT /api/auth/profile with JWT header
    const res = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(updates),
    });
    // ...
};
```

**Industry Standard:** This pattern is called a "Service Stub" or "Mock Service Layer." Libraries like MSW (Mock Service Worker) formalize this approach. LocalSaathi implements it inline — simpler but less maintainable at scale.

---

**9.1.2 — Session Restoration:**

```jsx
useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
}, []);
```

**What:** On app load, checks localStorage for a previously saved user session.

**Why:** SPAs lose all JavaScript state on page refresh. localStorage acts as a persistence bridge, ensuring users stay logged in across browser sessions.

**Security Consideration:** localStorage is NOT secure for tokens. Any JavaScript on the page (including XSS payloads) can read it. Production applications should use httpOnly cookies for JWT storage:

```javascript
// Production-grade approach:
// Server sets:
res.cookie('token', jwt, { httpOnly: true, secure: true, sameSite: 'Strict' });
// Client never touches the token — it's sent automatically with fetch({ credentials: 'include' })
```

---

**9.1.3 — Registration Branching:**

```jsx
const register = async (formData) => {
    if (formData.role === 'customer' || formData.role === 'shopkeeper') {
        // Instant demo registration — no backend needed
        const mockUser = { ...formData, id: Date.now().toString(), token: 'demo-token' };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
    }

    // Servicemen MUST use backend — quiz attempts tracked server-side
    const res = await fetch('http://localhost:5001/api/auth/register', { /* ... */ });
};
```

**Why servicemen need the backend:** Their quiz attempts are limited to 3 per skill profile. Storing this count in localStorage would allow users to simply clear browser data and retry infinitely. MongoDB provides tamper-proof persistence.

---

### **9.2 — `DataContext.jsx` — Business Logic Engine**

**File path:** `src/context/DataContext.jsx`

---

**9.2.1 — localStorage Persistence Pattern:**

```jsx
// Initialize from localStorage (lazy initializer — runs once on mount)
const [requests, setRequests] = useState(
    () => JSON.parse(localStorage.getItem('requests') || '[]')
);
const [quotations, setQuotations] = useState(
    () => JSON.parse(localStorage.getItem('quotations') || '[]')
);
const [bookings, setBookings] = useState(
    () => JSON.parse(localStorage.getItem('bookings') || '[]')
);
const [notifications, setNotifications] = useState(
    () => JSON.parse(localStorage.getItem('notifications') || '[]')
);

// Auto-sync each slice to localStorage on every change
useEffect(() => { localStorage.setItem('requests', JSON.stringify(requests)); }, [requests]);
useEffect(() => { localStorage.setItem('quotations', JSON.stringify(quotations)); }, [quotations]);
useEffect(() => { localStorage.setItem('bookings', JSON.stringify(bookings)); }, [bookings]);
useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
```

**Why lazy initializer `() => JSON.parse(...)`?** The function form runs only once during mount. Without it, `JSON.parse()` would execute on every re-render (though the result would be ignored after the first).

**Why 4 separate `useEffect`s?** Each effect only runs when its specific slice changes. A single effect watching all four would write all four to localStorage even if only one changed — unnecessary I/O.

---

**9.2.2 — Key Business Functions:**

| **Function**              | **Called By**            | **What It Does**                                                        |
|:--------------------------|:-------------------------|:------------------------------------------------------------------------|
| `addBooking()`            | BookService              | Creates booking with `status: 'pending'`, empty `interestedProviders`   |
| `expressInterest()`       | ServicemanDashboard      | Appends provider proposal to `booking.interestedProviders`, notifies    |
| `hireProvider()`          | CustomerDashboard        | Sets `status → 'accepted'`, calculates `agreedPrice`, clears others    |
| `updateBookingStatus()`   | JobDetails               | Transitions booking to `'completed'`                                   |
| `addBookingFeedback()`    | FeedbackPage             | Attaches `feedback` object to completed booking                        |
| `addRequest()`            | RequestMaterial          | Creates material request with `status: 'open'`                         |
| `addQuotation()`          | LeadDetails              | Creates quotation with `status: 'sent'`                                |
| `acceptQuotation()`       | RequestDetails           | Quotation → `'accepted'`, Request → `'closed'`, notifies shopkeeper   |
| `completeOrder()`         | ShopkeeperDashboard      | Quotation → `'completed'`, notifies customer                           |
| `addOrderFeedback()`      | OrderFeedbackPage        | Attaches `feedback` object to completed quotation                      |
| `getProviderRating()`     | ServicemanDashboard      | Averages `feedback.rating` across a serviceman's completed bookings    |
| `getShopkeeperRating()`   | ShopkeeperDashboard      | Averages `feedback.rating` across a shopkeeper's completed orders      |
| `getShopkeeperPoints()`   | ShopkeeperDashboard      | Returns `completedOrdersWithFeedback × 10` for tier calculation        |

---

**9.2.3 — The `hireProvider` Function (Critical State Transition):**

```jsx
const hireProvider = (bookingId, providerId) => {
    setBookings(prev => prev.map(b => {
        if (b.id === bookingId) {
            const provider = b.interestedProviders?.find(p => p.id === providerId);
            const agreedPrice = provider ? (provider.proposedRate || provider.rate) : 350;
            return {
                ...b,
                status: 'accepted',
                servicemanId: providerId,
                agreedPrice: agreedPrice,
                interestedProviders: []     // Clear other proposals
            };
        }
        return b;
    }));
};
```

**Why `interestedProviders: []`?** Once a provider is hired, other proposals are irrelevant. Clearing them reduces state size and prevents the UI from showing stale proposal cards.

**Why immutable update with `prev.map()`?** Mutating the existing array directly would bypass React's change detection — the UI wouldn't re-render. `prev.map()` creates a new array reference that React can detect as a change.

**What if `provider` is undefined?** The fallback `|| 350` ensures the booking still transitions to `accepted` with a default price, rather than crashing. In production, you'd throw an explicit error.

---

**9.2.4 — Rating Computation Functions:**

```jsx
const getProviderRating = (providerId) => {
    const providerBookings = bookings.filter(
        b => b.servicemanId === providerId && b.feedback
    );
    if (providerBookings.length === 0) return 0.0;
    const totalRating = providerBookings.reduce((sum, b) => sum + b.feedback.rating, 0);
    return (totalRating / providerBookings.length).toFixed(1);
};
```

**What:** Calculates a serviceman's average star rating across all completed bookings with feedback. Returns `0.0` for unrated providers (prevents NaN from division by zero).

**Why computed (not stored)?** Ratings are derived from feedback data. Storing them separately would create sync bugs where adding new feedback doesn't update the stored average.

---
---

## **10.0 — Reusable Components**

### **10.1 — `Navbar.jsx`**

**File path:** `src/components/Navbar.jsx`

**Three conditional UI states:**

| **State**        | **What Renders**                                         | **Logic**              |
|:-----------------|:---------------------------------------------------------|:-----------------------|
| Not logged in    | Login button + Register button                           | `!user`                |
| Logged in        | Profile chip + Notifications bell + Logout button        | `user` exists          |
| Any state        | Language selector (Globe icon + native `<select>`)       | Always visible         |

**Language Selector:**

```jsx
<Globe size={18} />
<select value={language} onChange={(e) => changeLanguage(e.target.value)}>
    {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
            {lang.native} ({lang.code.toUpperCase()})
        </option>
    ))}
</select>
```

**Why native `<select>`?** Accessibility (works with screen readers and keyboard), mobile UX (opens OS-native picker), and zero JavaScript needed for dropdown behavior.

**Notification Badge:**

```jsx
const unreadCount = notifications.filter(
    n => !n.read && (n.userId === user?.id || !n.userId)
).length;
```

This filter includes: notifications specifically for this user (`userId === user.id`) AND global/broadcast notifications (`!n.userId`).

**Responsive Hamburger Menu:** Uses CSS-class toggle (`active`) instead of conditional rendering (`{isOpen && <ul>...`}) to enable CSS transition animations on menu open/close. Conditional rendering would cause instant disappearance with no exit animation.

---

### **10.2 — `NotificationDropdown.jsx`**

**File path:** `src/components/NotificationDropdown.jsx`

```jsx
const sortedNotifs = [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));
```

**Why `[...notifications]` instead of `notifications.sort()`?** The `.sort()` method **mutates the original array in-place**. Since `notifications` comes from React state (DataContext), mutating it directly would violate React's immutability contract and cause unpredictable rendering behavior. The spread operator creates a shallow copy.

**Common Bug Warning:** `array.sort()`, `.reverse()`, `.splice()`, and `.fill()` are JavaScript's few array methods that mutate in-place. Always spread-copy before using them in React state.

---

### **10.3 — `AnimatedBackground.jsx` — Parallax Engine**

**File path:** `src/components/AnimatedBackground.jsx`

This component creates a parallax floating icon effect using mouse tracking.

**Mouse-Driven Parallax:**

```jsx
useEffect(() => {
    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;     // [-1, 1]
        const y = (e.clientY / window.innerHeight) * 2 - 1;    // [-1, 1]
        setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);
```

**Why normalize to [-1, 1]?** Raw pixel values would need different scaling per screen size. Normalized values make the parallax resolution-independent:
- `x = -1` → mouse at left edge
- `x = 0`  → mouse at center
- `x = 1`  → mouse at right edge

**Stable Random Positions with `useMemo`:**

```jsx
const iconsOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 15; i++) {
        options.push({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 40 + 30,
            opacity: Math.random() * 0.15 + 0.05,
            depth: Math.random() * 20 + 10,
        });
    }
    return options;
}, [theme]);
```

**Why `useMemo`?** Without it, every mouse move triggers a re-render (via `setMousePosition`), which would re-run `Math.random()`, causing all 15 icons to teleport to new positions 60 times per second. `useMemo` ensures positions stay fixed until the theme changes.

**Depth Illusion:** Icons with higher `depth` values move more pixels per mouse movement, creating the illusion that they're "closer" to the viewer — a 3D parallax effect.

---

### **10.4 — `PageTransition.jsx` — The Reflow Trick**

**File path:** `src/components/PageTransition.jsx`

```jsx
const PageTransition = ({ children }) => {
    const ref = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.classList.remove('page-enter');
        void el.offsetWidth;     // ← Force browser reflow
        el.classList.add('page-enter');
    }, [location.pathname]);

    return <div ref={ref} className="page-enter">{children}</div>;
};
```

**The `void el.offsetWidth` trick explained:**

1. `el.classList.remove('page-enter')` — removes the animation class
2. `el.classList.add('page-enter')` — adds it back

Without the reflow line, the browser batches these DOM operations and sees no net change (remove + add = no change). Reading `el.offsetWidth` forces the browser to calculate the element's layout between the remove and add, making it recognize the class removal before the re-addition. This restarts the CSS animation.

**What if `void el.offsetWidth` was removed?** The animation would only play once (on initial mount). Subsequent route changes would not trigger the animation.

**Industry Standard Alternative:** Libraries like Framer Motion handle this with `<AnimatePresence>`. This manual approach avoids a 30KB dependency.

---

### **10.5 — `AdminRoute.jsx`**

**File path:** `src/components/AdminRoute.jsx`

```jsx
const AdminRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
};
```

**Why `<Outlet />`?** `AdminRoute` is used as a layout route wrapper. Nested routes render via `<Outlet />`:

```jsx
<Route element={<AdminRoute />}>
    <Route path="admin" element={<AdminDashboard />} />
    <Route path="admin/users" element={<ManageUsers />} />
</Route>
```

**Why check `loading`?** On page refresh, AuthContext reads from localStorage asynchronously. Without this check, the guard would momentarily redirect to `/login` before the user is loaded — creating a flash.

---
---

## **11.0 — Pages — Authentication**

### **11.1 — `Login.jsx`**

**File path:** `src/pages/Login.jsx`

**Dual login paths:**

- **Standard form:** `handleSubmit()` → `login(identifier, password)` — accepts both email and phone
- **Demo buttons:** `handleDemoLogin('customer')` — instant one-click login for each role (Customer, Serviceman, Shopkeeper)

**Why `identifier` instead of `email`?** The field accepts both email addresses and phone numbers, common in Indian apps where many users prefer phone-based login. The backend determines the type: `identifier.includes('@') ? email : contact`.

**Typewriter effect:** CSS-only animation with `width: 0 → 100%` + `overflow: hidden` for typing illusion, and `border-right: 2px solid` with `@keyframes blink` for the cursor.

---

### **11.2 — `Register.jsx`**

**File path:** `src/pages/Register.jsx`

**Dynamic form fields based on selected role:**

- **Customer:** Name, identifier, password only
- **Shopkeeper:** + Shop name, GST number
- **Serviceman:** + Visual image-card skill selector (10 categories from `serviceThemes`), experience years

**Visual skill selector:** Image cards with Unsplash photos per service category. Designed for semi-literate service professionals in India who may find images more intuitive than text dropdowns. Each card uses `serviceThemes[service].image` and the service's theme colors.

**Post-registration routing:**

```jsx
if (formData.role === 'serviceman') {
    navigate('/skill-quiz');      // Must pass quiz before accessing dashboard
} else {
    navigate('/dashboard');       // Direct access for customers and shopkeepers
}
```

**Error forwarding from quiz failure:** When a serviceman fails the quiz, they're redirected to Register with an error message via React Router's location state:

```jsx
// In SkillQuiz.jsx (on failure):
navigate('/register', { state: { error: t.failedQuiz }, replace: true });

// In Register.jsx (reads the error):
useEffect(() => {
    if (location.state?.error) setError(location.state.error);
}, [location.state]);
```

---
---

## **12.0 — Pages — Dashboard Layer**

### **12.1 — `Dashboard.jsx` — Role Router**

**File path:** `src/pages/Dashboard.jsx`

```jsx
const Dashboard = () => {
    const { user } = useAuth();

    if (user.role === 'serviceman' && !user.skillVerified) {
        return <Navigate to="/skill-quiz" replace />;
    }

    switch (user.role) {
        case 'customer':   return <CustomerDashboard />;
        case 'shopkeeper': return <ShopkeeperDashboard />;
        case 'serviceman': return <ServicemanDashboard />;
        default:           return <CustomerDashboard />;
    }
};
```

**Why a single `/dashboard` URL for all roles?** Users always bookmark/share the same URL. The Navbar always links to `/dashboard` regardless of role. Role-switching (if implemented) works without URL changes.

**The `skillVerified` check:** Unverified servicemen are forcibly redirected to the quiz. Even if they manually type `/dashboard` in the URL, they cannot bypass verification.

---

### **12.2 — `CustomerDashboard.jsx`**

**File path:** `src/pages/CustomerDashboard.jsx`

**Derived data views (computed, not stored):**

```jsx
const myRequests = requests.filter(r =>
    r.userId === user.id &&
    !quotations.some(q => q.requestId === r.id && q.status === 'completed')
);
const myPendingBookings = bookings.filter(b => b.userId === user.id && b.status === 'pending');
const myUpcomingBookings = bookings.filter(b => b.userId === user.id && b.status === 'accepted');
const myCompletedBookings = bookings.filter(b => b.userId === user.id && b.status === 'completed');
```

**Why derive instead of store separately?** These are computed from the raw `bookings` array. Storing them as separate state would create sync bugs — completing a booking would require updating both `completedBookings` and `upcomingBookings`.

**Provider comparison section:** For each pending booking, shows all providers who expressed interest with:
- Name, rating (color-coded with `getRatingColor`), experience years
- Proposed rate per day, proposed hours per day
- Calculated total cost (`rate × days`)
- "Hire Pro" button for each provider

---

### **12.3 — `ServicemanDashboard.jsx`**

**File path:** `src/pages/ServicemanDashboard.jsx`

**Job board filtering — 3 simultaneous conditions:**

```jsx
const availableJobs = bookings.filter(b =>
    b.status === 'pending' &&                                    // Not yet accepted
    b.serviceCategory === user.skills &&                         // Matches my skill
    !b.interestedProviders?.some(p => p.id === user.id)         // Haven't bid yet
);
```

**Express Interest (proposal submission):**

```jsx
const handleExpressInterest = (bookingId) => {
    if (!proposedRate || !proposedTime) {
        alert('Please enter your rate and estimated time');
        return;
    }
    expressInterest(bookingId, {
        id: user.id,
        name: user.name,
        skills: user.skills,
        experience: user.experience,
        rating: getProviderRating(user.id),
        proposedRate,
        proposedTime
    });
};
```

**Why include `rating` in the proposal?** The customer sees ratings inline when comparing providers. Including it in the proposal object eliminates additional lookups.

---

### **12.4 — `ShopkeeperDashboard.jsx`**

**File path:** `src/pages/ShopkeeperDashboard.jsx`

**12-Level Tier/Reward System:**

```
Tier         Levels              Point Range
─────        ──────              ───────────
Bronze       I, II, III          0–149, 150–299, 300–499
Silver       I, II, III          500–749, 750–999, 1000–1499
Gold         I, II, III          1500–1999, 2000–2499, 2500–3499
Platinum     I, II, III          3500+
```

Each tier has unique visual properties: color, gradient, glow, border, bar color, shadow, and emoji.

**Points formula:** `completedOrdersWithFeedback × 10`

**Progress bar calculation:**

```jsx
const levelProgress = tier.nextPts
    ? Math.min(((LIVE_POINTS - tier.min) / (tier.nextPts - tier.min)) * 100, 100)
    : 100;  // Max level = full bar
```

- `LIVE_POINTS - tier.min` = points earned within this level
- `tier.nextPts - tier.min` = total points needed for this level
- `Math.min(..., 100)` caps at 100% to prevent visual overflow

---
---

## **13.0 — Pages — Service Booking Flow**

### **13.1 — `BookService.jsx`**

**File path:** `src/pages/BookService.jsx`

**Visual Service Selector:** A grid of image cards from `serviceThemes`. Selecting a card applies the service's theme colors (border, shadow, background). The `replace(/([A-Z])/g, ' $1').trim()` converts camelCase to display text (e.g., `DogWalker → Dog Walker`).

**Date validation — dual enforcement:**

1. **HTML:** `<input type="date" min={today} />` — browser grays out past dates
2. **JavaScript:** `if (value < today) return;` — catches manually typed past dates

**Contract mode:** Toggle switch enables a days-stepper. `Math.max(2, contractDays - 1)` prevents going below 2 (since single-day is a separate mode).

---

### **13.2 — `JobDetails.jsx`**

**File path:** `src/pages/JobDetails.jsx`

**Proof requirement before completion:**

```jsx
const handleComplete = () => {
    if (!proofImage) {
        alert('Please upload a completion proof (image) before marking as done.');
        return;
    }
    updateBookingStatus(job.id, 'completed', user.id);
};
```

**Why require proof?** This is a trust mechanism used by platforms like Urban Company and TaskRabbit. Before/after photos serve as dispute resolution evidence, quality assurance, and protection for the serviceman.

**Image preview** uses `URL.createObjectURL()` (memory-efficient blob URL) instead of `FileReader.readAsDataURL()` (base64 — 33% larger in memory).

---

### **13.3 — `FeedbackPage.jsx`**

**File path:** `src/pages/FeedbackPage.jsx`

**Star rating with hover preview:**

```jsx
<Star
    fill={(hover || rating) >= starValue ? "var(--warning-color)" : "transparent"}
    style={{ transform: (hover || rating) >= starValue ? 'scale(1.1)' : 'scale(1)' }}
/>
```

The `(hover || rating)` pattern: when hovering, stars light up to the hover position. When not hovering (`hover = 0` is falsy), they snap to the selected rating.

**Reward points calculation:**

```jsx
const multiplier = Math.random() * (0.01 - 0.005) + 0.005;  // 0.5% to 1.0%
const points = Math.max(1, Math.round(basePrice * multiplier));
```

**Why variable rewards?** Fixed rewards become predictable and boring. Variable rewards within a range activate the brain's dopamine system more effectively — a proven engagement technique.

---
---

## **14.0 — Pages — Material Request Flow**

### **14.1 — `RequestMaterial.jsx`**

**File path:** `src/pages/RequestMaterial.jsx`

**Image upload via FileReader:**

```jsx
const reader = new FileReader();
reader.onloadend = () => setImageStr(reader.result);
reader.readAsDataURL(file);  // Produces "data:image/png;base64,..."
```

**Why base64?** In demo mode (localStorage), there's no server to receive file uploads. Base64 embeds the image data directly into the JSON, storable in localStorage. Trade-off: base64 is ~33% larger than the original file.

**Image error fallback:**

```jsx
<img src={imageStr} onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }} />
```

Setting `e.target.onerror = null` prevents an infinite error loop if the fallback image also fails.

---

### **14.2 — `LeadDetails.jsx`**

**File path:** `src/pages/LeadDetails.jsx`

**Dual quotation modes:**

1. **Manual Line Items:** Spreadsheet-like interface. Auto-calculates `qty × price = total`.
2. **Image Upload:** Photo of a paper bill + manually entered grand total.

**Why two modes?** Targets two shopkeeper demographics: tech-savvy (digital inventory) and traditional (handwritten bills). This inclusive design increases adoption.

**Grand total (computed on-demand, not stored):**

```jsx
const calculateGrandTotal = () => {
    const baseTotal = quoteType === 'manual'
        ? lineItems.reduce((sum, item) => sum + (item.total || 0), 0)
        : (parseFloat(imageQuoteTotal) || 0);
    return baseTotal + (parseFloat(deliveryCharge) || 0);
};
```

---

### **14.3 — `RequestDetails.jsx`**

**File path:** `src/pages/RequestDetails.jsx`

**Mutual exclusion:** Once a quotation is accepted, accept buttons for other quotations are hidden. Prevents accidentally accepting multiple vendors for the same request.

---

### **14.4 — `OrderFeedbackPage.jsx`**

**File path:** `src/pages/OrderFeedbackPage.jsx`

Same star rating + reward logic as `FeedbackPage.jsx`, but operates on `quotations` (material orders) instead of `bookings` (service bookings). Uses `addOrderFeedback()` instead of `addBookingFeedback()`.

---
---

## **15.0 — Pages — Skill Verification**

### **15.1 — `SkillQuiz.jsx` — The Most Complex Page**

**File path:** `src/pages/SkillQuiz.jsx`

---

**15.1.1 — Two-Phase Question Loading:**

```jsx
// PHASE 1: Pick 5 random INDICES (once, on mount)
useEffect(() => {
    const qList = profileQuestions[normalizedCategory]?.['en'] || [];
    const indices = Array.from({ length: qList.length }, (_, i) => i);
    const shuffled = indices.sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestionIndices(shuffled);
}, [user]);

// PHASE 2: Hydrate with current LANGUAGE (re-runs on language change)
useEffect(() => {
    if (questionIndices.length === 0) return;
    const qList = profileData?.[language] || profileData?.['en'] || [];
    setQuestions(questionIndices.map(i => qList[i]));
}, [language, questionIndices, user]);
```

**Why two phases?** If the user switches language mid-quiz (e.g., English → Hindi), the SAME 5 questions must appear — just translated. Combining selection and hydration would re-randomize on language change, showing different questions.

---

**15.1.2 — `useSpeech` Custom Hook (TTS Engine):**

A complete Text-to-Speech engine built on the Web Speech API:

**Voice scoring algorithm:**

```jsx
const scoreVoice = (v, bcp47) => {
    const name = v.name.toLowerCase();
    let s = 0;
    if (v.lang === bcp47)          s += 100;    // Exact language match
    if (name.includes('premium'))  s += 80;     // Premium quality
    if (name.includes('neural'))   s += 80;     // Neural TTS
    if (name.includes('enhanced')) s += 60;     // Enhanced
    if (name.includes('natural'))  s += 50;     // Natural
    if (v.lang.includes('IN'))     s += 35;     // Indian voice
    if (name.includes('female'))   s += 40;     // Gender preference
    if (!v.localService)           s += 15;     // Cloud > local quality
    return s;
};
```

**Why scoring?** Different devices have wildly different voice libraries (macOS: 50+, Windows: 5–10, mobile: varies). The scoring system finds the best available voice on any device.

**Languages without reliable TTS — button hidden:**

```jsx
const NO_TTS_LANGS = new Set(['pa', 'gu', 'mr', 'ur', 'or', 'ml']);
```

Rather than showing a "Listen" button that silently fails, the UI hides it entirely.

**Speech segmentation:** The question, "Your options are", and each option are spoken as separate utterances, creating natural pauses between them.

---

**15.1.3 — Pass/Fail Logic:**

```jsx
const handleComplete = async () => {
    const passed = score >= 4;       // Must get 4 out of 5 correct
    await updateProfile({ quizScore: score, skillVerified: passed });
    if (passed) {
        navigate('/dashboard', { replace: true });
    } else {
        logout();
        navigate('/register', { state: { error: t.failedQuiz }, replace: true });
    }
};
```

**On failure:** Server increments `QuizAttempt.attempts` via the profile update. After 3 failures for a given skill profile, the user is permanently blocked from registering as that skill.

**Why logout on failure?** Prevents the failed serviceman from navigating to `/dashboard` via the URL bar.

---
---

## **16.0 — Pages — Profile Management**

### **16.1 — `CustomerProfile.jsx`**

**File path:** `src/pages/CustomerProfile.jsx`

Email field is **disabled** (read-only) — changing it would break authentication. In production, email changes require two-factor verification on both old and new addresses.

---

### **16.2 — `ServicemanProfile.jsx`**

**File path:** `src/pages/ServicemanProfile.jsx`

**Re-verification on any profile change:**

```jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = { ...formData };
    updates.skillVerified = false;     // ALWAYS require re-verification
    await updateProfile(updates);
    navigate('/skill-quiz');           // ALWAYS redirect to quiz
};
```

**Why so strict?** If a serviceman changes their skill from "Electrician" to "Plumber," their electrical verification is irrelevant. Even non-skill changes trigger re-verification for maximum trust.

**Dynamic theme:** The profile page's colors, background image, and gradients change dynamically based on the selected skill category via `useMemo(() => serviceThemes[formData.skills])`.

---

### **16.3 — `ShopkeeperProfile.jsx`**

**File path:** `src/pages/ShopkeeperProfile.jsx`

Business-specific fields: shop name, GST, address, business hours, delivery options, USPs. Form defaults use `|| ''` (not `?? ''`) because empty strings should also trigger the default.

---
---

## **17.0 — Pages — Admin Panel**

### **17.1 — `AdminDashboard.jsx`**

**File path:** `src/pages/admin/AdminDashboard.jsx`

Fetches platform stats from the backend:

```jsx
const response = await fetch('http://localhost:5001/api/admin/stats', {
    headers: { Authorization: `Bearer ${user.token}` },
});
```

Displays stat cards with staggered entrance animations.

**Note:** `http://localhost:5001` is hardcoded. In production, this should be `import.meta.env.VITE_API_URL`.

---

### **17.2 — `ManageUsers.jsx`**

**File path:** `src/pages/admin/ManageUsers.jsx`

- Full user table with role badges, verification status, join date
- **Verify:** `PUT /api/admin/verify/:id` → updates UI optimistically after server confirms
- **Delete:** `DELETE /api/admin/user/:id` → removes user from local state
- Uses `window.confirm()` for confirmation (production would use a custom modal)

**Note:** This file uses Tailwind CSS class names (`px-6`, `bg-gray-100`) unlike the rest of the app, suggesting it was built separately.

---
---

# **PART III — SUPPORTING SYSTEMS**

---

## **18.0 — CSS Design System**

**File path:** `src/index.css`

The `index.css` file is a **100+ token design system** built on CSS Custom Properties (variables). It provides the visual foundation for the entire application.

---

### **18.1 — Design Token Categories**

| **Category**        | **Token Count** | **Examples**                                             | **Purpose**                  |
|:--------------------|:----------------|:---------------------------------------------------------|:-----------------------------|
| Primary Colors      | 7               | `--primary-color: #4F46E5`, `--primary-ring`             | Brand accent (Indigo)        |
| Background Layers   | 6               | `--background-color: #F8FAFC`, `--surface-color`         | Visual depth hierarchy       |
| Typography          | 12              | `--font-size-xs` to `--font-size-5xl`, weights           | Consistent type scale        |
| Borders             | 4               | `--border-color: #E2E8F0`, `--border-focus`              | Edge definition              |
| Semantic Colors     | 8               | `--error-color`, `--success-color` + muted variants      | Status signaling             |
| Spacing Scale       | 7               | `--spacing-xs: 0.25rem` to `--spacing-3xl: 4rem`        | Consistent whitespace        |
| Shadows             | 7               | `--shadow-xs` to `--shadow-xl`, `--shadow-indigo`        | Elevation system             |
| Border Radii        | 7               | `--radius-xs: 0.25rem` to `--radius-full: 9999px`       | Corner rounding              |
| Transitions         | 4               | `--transition-fast`, `--transition-spring`                | Animation timing             |

---

### **18.2 — Button System (3-Tier Hierarchy)**

```
┌──────────────────────────────────────────────────────────────────────┐
│  TIER 1: .btn-primary                                                │
│  Gradient fill with shadow lift on hover                             │
│  Usage: Most prominent CTA — "Hire Pro", "Submit", "Book Now"        │
├──────────────────────────────────────────────────────────────────────┤
│  TIER 2: .btn-outline                                                │
│  Ghost with border, highlight on hover                               │
│  Usage: Secondary actions — "View Details", "Edit Profile"           │
├──────────────────────────────────────────────────────────────────────┤
│  TIER 3: .btn-ghost                                                  │
│  No border, text only, background on hover                           │
│  Usage: Tertiary actions — "Skip", "Maybe Later", "Cancel"           │
└──────────────────────────────────────────────────────────────────────┘
```

All buttons share a `.btn` base class with consistent padding, border-radius, font weights, and transitions.

---

### **18.3 — Badge System (Semantic Status Signals)**

| **CSS Class**                   | **Color**      | **Use Case**                        |
|:--------------------------------|:---------------|:------------------------------------|
| `.badge-open` / `.badge-new`    | Indigo         | New requests, open items            |
| `.badge-pending`                | Amber          | Waiting for action                  |
| `.badge-accepted`               | Emerald + glow | Confirmed / accepted items          |
| `.badge-completed`              | Slate          | Finished items                      |
| `.badge-error` / `.badge-rejected` | Red         | Failed or rejected items            |

---

### **18.4 — Animation Library**

| **Keyframe Name** | **Effect**                                   | **Used By**                                |
|:-------------------|:---------------------------------------------|:-------------------------------------------|
| `slideUp`          | Translate Y 20px → 0 with fade-in            | Page transitions, card entrances           |
| `scaleIn`          | Scale 0.96 → 1 with fade-in                  | Auth card entrance                         |
| `slideInRight`     | Translate X 24px → 0 with fade-in            | Notification appearance                    |
| `pulseGlow`        | Box-shadow pulse 0 → 4px                     | Accepted status badges                     |
| `shimmer`          | Background position sweep left → right       | Skeleton loading placeholders              |
| `shake`            | Horizontal oscillation (error feedback)       | Form input error state                     |
| `fadeIn`           | Simple opacity 0 → 1                         | General content appearance                 |

**Stagger utility classes:** `.stagger-1` through `.stagger-5` add incremental animation delays (0.04s, 0.10s, 0.16s, 0.22s, 0.28s) for cascading list animations.

---
---

## **19.0 — CSS File Documentation**

### **19.1 — `Auth.css`**

**File path:** `src/styles/Auth.css`

**Split-hero layout:** `.auth-split-layout` creates a 50/50 horizontal split:
- **Left side** (`.auth-form-side`): White background, centered form card
- **Right side** (`.auth-hero-side`): Gradient overlay + background image + decorative radial glows via `::before` and `::after` pseudo-elements

**Key animation patterns:**
- Auth card uses `scaleIn` animation for entrance
- Brand name uses `background-clip: text` for gradient text effect
- Form groups have **staggered entrance** via `nth-child` delays (0.06s, 0.12s, 0.18s, 0.24s)
- Hero side hides on mobile (`@media max-width: 968px`) → form takes full width

---

### **19.2 — `Navbar.css`**

**File path:** `src/components/Navbar.css`

- **Sticky + glassmorphic:** `position: sticky; backdrop-filter: blur(12px); z-index: 999`
- **Logo hover:** `transform: scale(1.06) rotate(-3deg)` — subtle tilt microinteraction
- **Logout button hover:** Turns red with `rotate(8deg) scale(1.08)` — visual "danger" cue
- **Mobile menu transition:** Uses `opacity + transform + pointer-events` toggling (not conditional rendering) to enable smooth CSS transitions

---

### **19.3 — `LoadingPage.css`**

**File path:** `src/components/LoadingPage.css`

Five coordinated animations:

1. `bgPulse` — Background radial glow scales and fades alternately
2. `logoFloat` — Logo bobs up/down 6px with 3% scale change
3. `ringPulse` — Concentric rings expand from scale 0.6 to 1.6 and fade (sonar effect)
4. `fadeInUp` — Title, progress bar, and subtitle fade in with staggered delays (0.3s, 0.6s, 0.9s)
5. `fillBar` + `shimmerBar` — Non-linear progress fill (fast to 60%, slow to 90%, push to 100%) with shimmer overlay

---
---

## **20.0 — Utility Modules**

### **20.1 — `translations.js` — 12-Language Internationalization**

**File path:** `src/utils/translations.js`

**Structure:** Static dictionary with ~84 UI labels × 12 Indian languages.

**Supported languages:**

| **Code** | **Language** | **Native Script** |
|:---------|:-------------|:------------------|
| `en`     | English      | English           |
| `hi`     | Hindi        | हिन्दी            |
| `bn`     | Bengali      | বাংলা             |
| `te`     | Telugu       | తెలుగు            |
| `mr`     | Marathi      | मराठी             |
| `ta`     | Tamil        | தமிழ்             |
| `gu`     | Gujarati     | ગુજરાતી           |
| `kn`     | Kannada      | ಕನ್ನಡ             |
| `ml`     | Malayalam    | മലയാളം            |
| `pa`     | Punjabi      | ਪੰਜਾਬੀ            |
| `ur`     | Urdu         | اردو              |
| `or`     | Odia         | ଓଡ଼ିଆ             |

**Usage pattern:**

```jsx
const { language } = useData();
const t = translations[language];
// Then: <h1>{t.welcome}, {user.name}!</h1>
```

**Why a static dictionary instead of react-i18next?** Zero dependencies, instant load, works offline. Libraries add value at 1000+ keys with plural forms, interpolation, and lazy loading.

---

### **20.2 — `serviceThemes.js` — Visual Identity System**

**File path:** `src/utils/serviceThemes.js`

Each of the 10 service categories has a complete theme object with 9 properties:

| **Property**       | **Example (Electrician)**                                           | **Purpose**                          |
|:-------------------|:--------------------------------------------------------------------|:-------------------------------------|
| `primary`          | `'#F59E0B'`                                                         | Main brand color                     |
| `secondary`        | `'#FCD34D'`                                                         | Lighter accent                       |
| `accent`           | `'rgba(245,158,11,0.12)'`                                           | Translucent background               |
| `border`           | `'rgba(245,158,11,0.30)'`                                           | Themed borders                       |
| `gradient`         | `'linear-gradient(135deg, ...)'`                                    | Background gradient                  |
| `buttonGradient`   | `'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'`              | CTA button gradient                  |
| `icon`             | `Zap` (Lucide component)                                            | Primary icon                         |
| `icons`            | `[Zap, Lightbulb, Plug, Cable]`                                     | Background floating icons            |
| `image`            | Unsplash URL                                                        | Category background image            |

**Color psychology:** Electrician = Amber (energy), Plumber = Cyan (water), Carpenter = Brown (wood), Painter = Violet (creativity), Cleaning = Emerald (freshness), Guard = Slate (authority).

---

### **20.3 — `ratingColors.js` — Traffic-Light Rating System**

**File path:** `src/utils/ratingColors.js`

```javascript
export const getRatingColor = (rating) => {
    const r = parseFloat(rating) || 0;
    if (r === 0)   return '#94a3b8';    // Slate  — unrated (neutral, not punitive)
    if (r < 2.5)   return '#ef4444';    // Red    — poor
    if (r < 4.0)   return '#eab308';    // Yellow — average
    return '#10b981';                    // Green  — good
};
```

**Why 4 levels?** The `0` (unrated) case is deliberately neutral so new providers aren't penalized with a red rating. Matches Google Maps, Yelp, and Amazon color psychology.

---
---

## **21.0 — Quiz Question Bank**

### **21.1 — File Structure**

**File path:** `src/data/quizQuestions.js` — **2.6 MB** (the largest file in the project)

```javascript
export const quizQuestions = {
    "en": {                           // Language code
        "Electrician": [              // Skill category
            {
                "question": "What is the primary safety measure...?",
                "options": [
                    "Wear rubber gloves",
                    "Wash hands before starting",
                    "Use metal tools",
                    "Work barefoot"
                ],
                "correct": 0          // Zero-indexed correct answer
            },
            // ... 20 questions per category
        ],
        "Plumber": [ /* 20 questions */ ],
        "Carpenter": [ /* 20 questions */ ],
        // ... 10 categories total
    },
    "hi": {                           // Same structure in Hindi
        "Electrician": [ /* 20 questions */ ],
        // ...
    },
    // ... 12 languages total
};
```

**Scale:** 10 categories × 20 questions × 12 languages = **2,400 question objects**

**Why 20 per category?** The quiz picks 5 randomly, yielding C(20,5) = 15,504 possible combinations — making memorization impractical.

---
---

## **22.0 — Backend — Server**

### **22.1 — `server/index.js` — Express Entry Point**

**Middleware execution order (sequential — order matters):**

| **Order** | **Middleware**            | **Purpose**                                      |
|:----------|:-------------------------|:-------------------------------------------------|
| 1         | `express.json()`         | Parse JSON request bodies                        |
| 2         | `cors()`                 | Allow cross-origin requests (port 5173 → 5001)  |
| 3         | `helmet()`               | Set 11+ security headers                        |
| 4         | Custom sanitizer          | Strip NoSQL injection keys + XSS payloads        |
| 5         | `rateLimit(100/10min)`   | Throttle requests per IP                         |
| 6         | Route handlers            | Process API requests                             |

**NoSQL Injection Prevention:**

```javascript
if (key.startsWith('$') || key.includes('.')) {
    delete req.body[key];
}
```

Prevents attacks like `{"email": {"$gt": ""}}` which would match ALL users in MongoDB.

**XSS Sanitization:**

```javascript
req.body[key] = sanitizeHtml(req.body[key], { allowedTags: [], allowedAttributes: {} });
```

Strips ALL HTML tags, preventing `<script>` injection in stored data.

---

### **22.2 — `server/config/db.js`**

```javascript
const conn = await mongoose.connect(process.env.MONGO_URI);
```

Exits with `process.exit(1)` on connection failure — signals process managers (PM2, Docker) to restart.

---

### **22.3 — `server/middleware/authMiddleware.js`**

**Two functions:**

| **Function** | **Purpose**                                                     |
|:-------------|:----------------------------------------------------------------|
| `protect`    | Extracts JWT from `Authorization: Bearer <token>`, verifies it, attaches `req.user` (excluding password) |
| `admin`      | Used after `protect`; checks `req.user.role === 'admin'`         |

`.select('-password')` excludes the password hash from the user object attached to `req.user` — principle of least privilege.

---

### **22.4 — `server/models/User.js`**

**Key schema design decisions:**

| **Field**          | **Design Choice**                                           | **Why**                                        |
|:-------------------|:------------------------------------------------------------|:-----------------------------------------------|
| `email`/`contact`  | `sparse: true, unique: true`                                | Allows null; some users register with phone only |
| `serviceType`      | `required: function() { return this.role === 'serviceman' }`| Conditional validation per role                |
| `password`         | `pre('save')` hook with bcrypt (10 rounds)                   | Auto-hashes; `isModified` prevents re-hashing   |

---

### **22.5 — `server/models/QuizAttempt.js`**

Compound unique index: `{ identifier: 1, profile: 1 }` — tracks attempts per user per skill category independently.

---

### **22.6 — `server/routes/authRoutes.js`**

**Three critical safeguards in the registration endpoint:**

1. **Admin prevention:** Returns 403 if `role === 'admin'` — admins only via `createAdmin.js` script
2. **Quiz attempt limit:** Checks `QuizAttempt.attempts >= 3` before allowing serviceman registration
3. **Unverified overwrite:** If a serviceman exists but `skillVerified === false`, account is overwritten

**Profile update with atomic attempt tracking:**

```javascript
if (req.body.skillVerified === false && user.role === 'serviceman') {
    await QuizAttempt.findOneAndUpdate(
        { identifier, profile: user.skills },
        { $inc: { attempts: 1 } },       // Atomic increment — no race conditions
        { upsert: true, new: true }       // Create document if doesn't exist
    );
}
```

---

### **22.7 — `server/routes/adminRoutes.js`**

All endpoints protected by `protect + admin` middleware:

| **Method** | **Endpoint**           | **What It Does**                                |
|:-----------|:-----------------------|:------------------------------------------------|
| `GET`      | `/api/admin/stats`     | Counts users and servicemen with `countDocuments()` |
| `GET`      | `/api/admin/users`     | Returns all users                                |
| `PUT`      | `/api/admin/verify/:id`| Sets `isVerified = true`                         |
| `DELETE`   | `/api/admin/user/:id`  | Removes user from database                       |

---

### **22.8 — Seed Data & Scripts**

| **File**           | **Purpose**                                               | **Key Detail**                               |
|:-------------------|:----------------------------------------------------------|:---------------------------------------------|
| `data/users.js`    | 19 pre-defined test users across all roles                | Passwords are plain-text (hashed by pre-save)|
| `seeder.js`        | Imports seed data into MongoDB                            | Uses `for...of` + `User.create()` for middleware |
| `createAdmin.js`   | Creates/resets the admin account                          | Requires direct server access (not API)      |

---
---

## **23.0 — REST API Reference**

| **Method** | **Endpoint**              | **Auth Required**    | **Request Body / Params**                                                          | **Response**                    |
|:-----------|:--------------------------|:---------------------|:-----------------------------------------------------------------------------------|:--------------------------------|
| `POST`     | `/api/auth/register`      | None                 | `{ name, identifier, password, role, skills?, shopName?, gst? }`                   | User object + JWT token         |
| `POST`     | `/api/auth/login`         | None                 | `{ identifier, password }`                                                         | User object + JWT token         |
| `PUT`      | `/api/auth/profile`       | Bearer JWT           | `{ name?, contact?, skills?, skillVerified?, quizScore?, rewardPoints?, rating? }` | Updated user + new JWT token    |
| `GET`      | `/api/admin/stats`        | Bearer JWT + Admin   | —                                                                                  | `{ users: Number, servicemen: Number }` |
| `GET`      | `/api/admin/users`        | Bearer JWT + Admin   | —                                                                                  | Array of User objects            |
| `PUT`      | `/api/admin/verify/:id`   | Bearer JWT + Admin   | `:id` (URL parameter)                                                              | Updated user object              |
| `DELETE`   | `/api/admin/user/:id`     | Bearer JWT + Admin   | `:id` (URL parameter)                                                              | `{ message: 'User removed' }`   |

---
---

## **24.0 — Security Architecture**

The application implements **7 layers of defense:**

| **Layer** | **Implementation**                                         | **What It Prevents**                            |
|:----------|:-----------------------------------------------------------|:------------------------------------------------|
| 1. Transport | CORS (cross-origin allowed for dev)                    | Unauthorized domain access                      |
| 2. Headers   | Helmet (CSP, X-Frame-Options, HSTS, etc.)              | Clickjacking, MIME sniffing, XSS                |
| 3. Rate Limiting | 100 requests per 10 minutes per IP                 | Brute force attacks, DoS                        |
| 4. NoSQL Injection | Strip `$` and `.` prefixed keys from body         | MongoDB operator injection attacks              |
| 5. XSS Sanitization | `sanitize-html` strips ALL HTML tags              | `<script>` injection, stored XSS                |
| 6. Authentication | JWT verification via `protect` middleware           | Unauthorized API access                         |
| 7. Authorization | Role check via `admin` middleware                    | Privilege escalation                            |

**Additional security measures:**

- Passwords are hashed with bcrypt (10 salt rounds) before database storage
- Admin accounts cannot be created via the API — only via the `createAdmin.js` script with direct server access
- Quiz attempts are tracked server-side to prevent brute-force quiz-passing
- `.select('-password')` excludes password hashes from all API responses
- JWT tokens include user ID and role, verified on every protected request

---
---

## **25.0 — Error Handling Patterns**

### **25.1 — Frontend Error Patterns**

| **Pattern**               | **Code Example**                                                         | **Recovery**                          |
|:--------------------------|:-------------------------------------------------------------------------|:--------------------------------------|
| Inline validation         | `if (!formData.name) { setError('Please fill all fields'); return; }`    | User corrects input                   |
| API error propagation     | `if (!res.ok) { setError(data.message); }`                               | Error banner shown in auth forms      |
| Graceful degradation      | `parseFloat(value) \|\| 0`                                              | Invalid numbers default to zero       |
| Image fallback            | `onError={(e) => { e.target.onerror = null; e.target.src = logo; }}`    | Shows logo instead of broken image    |
| Optional chaining         | `selectedProvider?.proposedRate`                                         | Returns undefined instead of crashing |
| Navigation state errors   | `location.state?.error` → read error from quiz failure redirect          | Error shown on register page          |

### **25.2 — Backend Error Patterns**

| **Pattern**          | **Code Example**                                                        | **HTTP Code**    |
|:---------------------|:------------------------------------------------------------------------|:-----------------|
| Validation fallback  | `if (!validRoles.includes(role))` → defaults to `'customer'`            | Corrects silently|
| Admin prevention     | `if (role === 'admin') return res.status(403)`                          | 403 Forbidden    |
| Duplicate user       | `if (userExists && userExists.skillVerified) return res.status(400)`    | 400 Bad Request  |
| Quiz limit exceeded  | `if (attempts >= 3) return res.status(400)`                             | 400 Bad Request  |
| Not found            | `if (!user) return res.status(404)`                                     | 404 Not Found    |
| Server error         | `catch (error) { res.status(500).json({ message: error.message }) }`    | 500 Internal     |

---
---

## **26.0 — Glossary of Terms**

| **Term**                  | **Definition**                                                                                    |
|:--------------------------|:--------------------------------------------------------------------------------------------------|
| **Booking**               | A customer's request for a professional service (electrician, plumber, etc.)                       |
| **Request**               | A customer's request for building materials, sent to all shopkeepers                                |
| **Quotation**             | A shopkeeper's price proposal in response to a material Request                                   |
| **Lead**                  | A material Request as seen from the shopkeeper's perspective                                      |
| **Order**                 | A quotation that has been accepted by the customer                                                 |
| **Interested Provider**   | A serviceman who has proposed a rate and time for a Booking                                        |
| **Express Interest**      | The act of a serviceman submitting a proposal (rate + hours) for a job                            |
| **Hire Pro**              | The customer's action of selecting and confirming a serviceman                                     |
| **Agreed Price**          | The final price calculated when a provider is hired (daily rate × contract days)                  |
| **Skill Quiz**            | A 5-question verification test servicemen must pass (score ≥ 4 out of 5)                         |
| **Skill Verified**        | Boolean flag indicating a serviceman has passed the skill quiz                                     |
| **Demo Token**            | The literal string `'demo-token'` — distinguishes offline/demo mode from real JWT auth             |
| **Demo User**             | Hardcoded user objects in AuthContext for offline demonstration                                    |
| **Profile (quiz context)**| The skill category being tested (e.g., "Electrician", "Plumber")                                  |
| **Tier**                  | Shopkeeper reward level (Bronze I through Platinum III — 12 levels)                               |
| **Reward Points**         | Currency earned by customers (from feedback) and shopkeepers (from completed orders)              |
| **BCP-47**                | IETF language tag standard used by the Web Speech API (e.g., `en-IN`, `hi-IN`)                    |
| **TTS**                   | Text-to-Speech — SkillQuiz's accessibility feature using the Web Speech API                       |
| **useSpeech**             | Custom React hook encapsulating TTS voice discovery, caching, and speech rendering                |
| **Reflow**                | Browser layout recalculation; forced with `void el.offsetWidth` to restart CSS animations         |
| **Sparse Index**          | MongoDB index that skips documents with null/missing field values                                 |
| **Upsert**                | MongoDB operation: update if exists, insert if not (`{ upsert: true }`)                           |
| **Pre-save Hook**         | Mongoose middleware that runs before `document.save()` — used here for password hashing           |
| **OWASP**                 | Open Web Application Security Project — security standards referenced throughout this document    |
| **HOC**                   | Higher-Order Component — a React pattern that wraps components to add behavior (e.g., PrivateRoute)|

---
---

## **27.0 — Industry Standards Summary**

| **Area**              | **Approach Used**                     | **Assessment**                | **Production Alternative**                   |
|:----------------------|:--------------------------------------|:------------------------------|:---------------------------------------------|
| Password Storage      | bcrypt, 10 salt rounds                | ✅ OWASP recommended minimum | Argon2id (newer, memory-hard)                |
| Token Format          | JWT, 30-day expiry                    | ⚠️ Long expiry for demo      | Short-lived (15 min) + refresh tokens        |
| Token Storage         | localStorage                          | ❌ XSS vulnerable            | httpOnly cookies with SameSite: Strict       |
| State Management      | Context API + useState                | ✅ Appropriate for scale     | Redux / Zustand for 50+ components           |
| Internationalization  | Static dictionary (84 keys × 12 langs)| ✅ Appropriate for scale     | react-i18next for 1000+ keys                 |
| API Security          | Helmet + Rate Limit + Sanitize        | ✅ OWASP middleware stack    | Add WAF, strict CORS origin whitelist        |
| NoSQL Injection       | Key prefix stripping                  | ⚠️ Basic defense             | Mongoose strictQuery + schema validation     |
| XSS Prevention        | sanitize-html (server-side)           | ✅ Server-side sanitization  | Add CSP headers + client-side DOMPurify      |
| Routing Guards        | Component-based PrivateRoute          | ✅ Standard React pattern    | Data-loader redirects (react-router v6.4+)   |
| File Upload           | Base64 in localStorage (demo)         | ❌ Not production-ready      | S3 / Cloudinary with presigned URLs          |
| Accessibility         | Web Speech API TTS                    | ✅ Innovative for demographic| Add ARIA live regions + screen reader testing|
| Styling               | CSS Variables design system           | ✅ Maximum control           | CSS-in-JS (styled-components) for colocation |
| ID Generation         | `Date.now().toString()`               | ⚠️ Demo-sufficient           | `crypto.randomUUID()` or server-generated    |
| Real-time Updates     | None (polling-free demo)              | ❌ Users must refresh        | WebSockets or SSE for live updates           |

---
---

*— End of Document —*

*This documentation covers the complete LocalSaathi codebase: 30+ source files, 10+ service categories, 12 languages, 7 security layers, and end-to-end user journeys for all three roles.*
