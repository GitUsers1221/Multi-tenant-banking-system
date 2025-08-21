const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Route Imports
const accountsRoutes = require("./routes/accounts");
const customersRoutes = require("./routes/customers");
const transactionsRoutes = require("./routes/transactions");
const loansRoutes = require("./routes/loans");
const banksRoutes = require("./routes/banks");
const auditRoutes = require("./routes/audit");

// Route Middlewares
app.use("/api/accounts", accountsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/banks", banksRoutes);
app.use("/api/audit", auditRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
