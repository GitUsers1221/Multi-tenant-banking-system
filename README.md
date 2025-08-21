🏦 Multi-Tenant Banking System

A full-stack banking management system built with Node.js (backend), MySQL (database), and vanilla JavaScript/HTML/CSS (frontend).
This project demonstrates multi-tenant architecture, allowing multiple banks (tenants) to run on the same system while keeping their data isolated and secure.

✨ Features

👤 User Management – Register, log in, and manage customers.

🏦 Multi-Tenant Support – Each bank has its own data, securely separated.

💳 Banking Operations – Basic account handling and transaction management.

🔐 Secure Database Layer – MySQL integration with separate schemas.

🌐 Frontend Interface – Simple web UI for interactions.

🚀 Getting Started
1. Clone the Repository
git clone https://github.com/GitUsers1221/Multi-tenant-banking-system.git
cd Multi-tenant-banking-system

2. Set Up the Backend
cd backend
npm install


Copy .env.example to .env and configure your MySQL credentials.

Run database setup scripts:

node setup-database.js

3. Import SQL Schema

Import backfront.sql into your MySQL server manually or with:

mysql -u root -p < backfront.sql

4. Start the Backend Server
node index.js

5. Run the Frontend

Open frontend/index.html in your browser.

## 📂 Project Structure  

```plaintext
Multi-tenant-banking-system/
│── backend/           # Node.js backend
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── db.js          # Database connection
│   ├── index.js       # Server entry point
│   └── setup-database.js
│
│── frontend/          # Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── script.js
│   └── styles.css
│
│── backfront.sql      # MySQL Database
│── README.md          # Project documentation
```

🛠️ Tech Stack

Backend: Node.js, Express

Database: MySQL

Frontend: HTML, CSS, JavaScript
