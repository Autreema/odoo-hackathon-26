# 🚍 TransitOps

**Smart Transport Operations Platform**

TransitOps is a modern full-stack fleet management platform that digitizes transport operations by providing a centralized system for managing vehicles, drivers, trips, maintenance, fuel expenses, and operational analytics.

Designed for logistics teams and fleet operators, TransitOps improves fleet visibility, automates dispatch workflows, monitors vehicle health, and enables data-driven decision-making to reduce operational costs and improve efficiency.

---

## 🌐 Live Demo

**Application:** https://femmehaker-38h5.vercel.app

---

# 📖 Overview

Managing transportation operations manually often leads to scheduling conflicts, inefficient fleet utilization, delayed maintenance, and poor operational visibility.

TransitOps addresses these challenges through an integrated platform that allows organizations to:

* Manage the complete fleet lifecycle
* Monitor vehicle availability
* Assign drivers intelligently
* Schedule and track trips
* Record maintenance activities
* Monitor fuel usage and expenses
* Analyze fleet performance using interactive dashboards

---

# ✨ Key Features

## 🔐 Authentication & Role-Based Access

* Secure user authentication
* Role-based authorization
* Protected application routes
* Personalized dashboards

### Demo Roles

* Fleet Manager
* Dispatcher
* Safety Officer
* Finance Analyst

---

## 📊 Smart Dashboard

The dashboard provides a real-time overview of fleet operations.

### Fleet Metrics

* Total Vehicles
* Available Vehicles
* Vehicles on Trip
* Vehicles Under Maintenance
* Active Trips
* Drivers on Duty
* Fleet Utilization Rate

### Analytics

* Fleet performance
* Operational trends
* Cost analysis
* Fuel analytics
* Vehicle utilization insights

---

## 🚚 Vehicle Management

Manage the complete lifecycle of fleet vehicles.

### Features

* Add vehicles
* Edit vehicle information
* Delete vehicles
* Track vehicle availability
* Monitor operational status

### Vehicle Status

* Available
* On Trip
* In Shop
* Retired

---

## 👨‍✈️ Driver Management

Maintain driver information and assignment eligibility.

### Features

* Driver profiles
* License management
* Safety score monitoring
* Availability tracking

### Business Rules

* Drivers with expired licenses cannot be assigned.
* Suspended drivers cannot be assigned.
* Duplicate driver assignments are prevented.

---

## 🛣️ Trip Management

Automate transport operations using an intelligent dispatch workflow.

### Trip Lifecycle

```text
Draft
   │
   ▼
Dispatched
   │
   ▼
Completed

or

Cancelled
```

### Automation

* Automatic vehicle status updates
* Automatic driver status updates
* Cargo capacity validation
* Prevents duplicate vehicle assignments
* Prevents duplicate driver assignments

---

## 🔧 Maintenance Management

Maintain vehicle health through preventive and corrective maintenance tracking.

### Features

* Create maintenance records
* Record repair history
* Automatically move vehicles to **In Shop**
* Restore vehicle availability after maintenance completion

---

## ⛽ Fuel & Expense Management

Monitor operational expenses in a centralized dashboard.

### Track

* Fuel consumption
* Fuel expenses
* Maintenance costs
* Other operational expenses

### Analytics

* Fuel efficiency
* Operating cost
* Vehicle ROI
* Expense reports

---

## 📈 Analytics Dashboard

Generate operational insights for better business decisions.

### Reports

* Fleet utilization
* Vehicle performance
* Fuel efficiency
* Operational cost analysis
* Exportable reports

---

# 🛠 Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Recharts
* Lucide React

## Backend

* Python
* Flask
* REST API

## Database

* SQLite
* MySQL

## Deployment

* Vercel

## Development Tools

* Git
* GitHub
* VS Code

---

# 📁 Project Structure

```text
TransitOps/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── database/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/TransitOps.git
cd TransitOps
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

## Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend server will start locally.

---

# 🔧 Environment Variables

Create a `.env` file inside the backend directory.

```env
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
```



If you found this project helpful, consider giving it a ⭐ on GitHub.
