# Booking Frontend

On-Demand Service Slot Lock & Dispatch Engine — React + TypeScript frontend.

---

## Tech Stack

- React 18 + TypeScript
- Vite 5
- TanStack Query v5 (server state)
- Axios (HTTP client)
- Tailwind CSS v3
- Vitest + Testing Library (unit & component tests)

---

## Features

- Register / Login / Logout with Sanctum token auth
- Staff selector and date picker
- Live available slot grid with status indicators
- Concurrency-safe reservation with duplicate submission prevention
- Live 5-minute countdown timer (server timestamp as source of truth)
- 409 conflict handling with automatic slot refresh
- Confirm / Cancel reservation flow
- My Bookings page — full reservation history with live countdowns
- Pagination on My Bookings
- Loading skeletons and error states throughout

---

## Requirements

- Node.js >= 18
- npm >= 9
- Backend API running at `http://localhost:8000`

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/booking-frontend.git
cd booking-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

```bash
cp .env.example .env
```

`.env` contents:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Start the development server

```bash
npm run dev
```

App runs at `http://localhost:5173`

> Make sure the backend is running at `http://localhost:8000` before starting the frontend.

---

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

---

## Running Both Backend & Frontend

Open two terminals:

```bash
# Terminal 1 — Backend
cd booking-api
php artisan serve

# Terminal 2 — Frontend
cd booking-frontend
npm run dev
```

Then open `http://localhost:5173`

---

## Project Structure

```
src/
├── api/                  # Axios API calls
│   ├── axios.ts          # Axios instance with interceptors
│   ├── authApi.ts        # Register, login, logout
│   ├── bookingApi.ts     # Reserve, confirm, cancel, my bookings
│   ├── slotApi.ts        # Fetch available slots
│   └── staffApi.ts       # Fetch staff list
├── components/
│   ├── auth/             # LoginForm, RegisterForm
│   ├── booking/          # StaffSelector, DateSelector, SlotList, SlotCard, ReservationCountdown
│   └── common/           # Loader, ErrorMessage, ConfirmDialog
├── context/
│   └── AuthContext.tsx   # Auth state (login, register, logout)
├── hooks/
│   ├── useAvailableSlots.ts  # TanStack Query for slots
│   ├── useCountdown.ts       # Interval-based countdown (no memory leaks)
│   └── useReservation.ts     # Reserve, confirm, cancel state machine
├── pages/
│   ├── AuthPage.tsx          # Login / Register page
│   ├── BookingPage.tsx       # Main booking flow
│   └── MyBookingsPage.tsx    # User's reservation history
├── types/
│   └── booking.ts            # TypeScript interfaces
└── utils/
    ├── date.ts               # formatTime, formatCountdown, todayString
    └── errorHandler.ts       # extractErrorMessage, isConflictError
```

---

## User Flow

```
1. Register or Login
2. Select a staff member
3. Select a date
4. Click "Reserve Slot" on an available slot
5. Countdown starts (05:00 → 00:00)
6. Click "Confirm Booking" to finalize
   — or —
   Click "Cancel" to release the slot
7. Switch to "My Bookings" tab to see all reservations
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Backend API base URL |

---

## License

MIT
# booking-frontend
# booking-frontend
# booking-frontend
# booking-frontend
