# TransitOps 
## Smart Transport Operations Platform

TransitOps is a full-stack fleet management platform designed to digitize transport operations by managing vehicles, drivers, trips, maintenance, fuel expenses, and operational analytics in one centralized system.

The platform helps logistics teams improve fleet visibility, automate dispatch workflows, monitor vehicle health, and optimize operational costs.



live demo link :  https://femmehaker-38h5.vercel.app


---

#  Key Features

##  Authentication & Role-Based Access

- Secure login system
- Role-based dashboards
- User access control

Demo Roles:

- Fleet Manager
- Dispatcher
- Safety Officer
- Finance Analyst


---

#  Smart Dashboard

Provides real-time operational insights:

- Total Vehicles
- Available Vehicles
- Vehicles On Trip
- Maintenance Vehicles
- Active Trips
- Drivers On Duty
- Fleet Utilization

Includes:

- Performance charts
- Cost analysis
- Fuel analytics
- Operational insights


---

#  Vehicle Management

Complete vehicle lifecycle management:

Features:

- Add vehicles
- Update vehicle details
- Delete vehicles
- Track availability
- Monitor vehicle status

Vehicle statuses:

- Available
- On Trip
- In Shop
- Retired


---

#  Driver Management

Manage driver information:

- Driver profiles
- License tracking
- Safety score monitoring
- Driver availability

Validation:

- Expired licenses cannot be assigned
- Suspended drivers cannot be assigned


---

#  Trip Management

Smart dispatch workflow:

Trip lifecycle:

Draft → Dispatched → Completed → Cancelled


Business automation:

- Vehicle status automatically updates
- Driver status automatically updates
- Cargo capacity validation
- Prevents duplicate assignments


---

#  Maintenance Management

Track vehicle maintenance:

- Create maintenance records
- Monitor repair history
- Automatically move vehicles to "In Shop"
- Restore availability after completion


---

#  Fuel & Expense Management

Track:

- Fuel consumption
- Fuel cost
- Maintenance expenses
- Operational expenses


Analytics:

- Fuel efficiency
- Total operational cost
- Vehicle ROI


---

#  Analytics Dashboard

Provides:

- Fleet utilization
- Cost analysis
- Fuel efficiency reports
- Exportable reports


---

#  Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide Icons


## Backend

- REST API Architecture
- Python Flask


## Database

- SQLite / MySQL


## Tools

- GitHub
- VS Code
- Vercel Deployment


---

#  Project Structure
TransitOps

├── frontend
│ ├── React Application
│ ├── Components
│ └── Dashboard UI
│
├── backend
│ ├── Flask API
│ ├── Database
│ └── Services
│
└── README.md


🌐 Live Demo

Frontend:
https://femmehaker-38h5.vercel.app
