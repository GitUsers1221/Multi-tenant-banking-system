const express = require("express");
const router = express.Router();

// Import the controller functions
const auditController = require("../controllers/auditController");

// Define the route to get all audit logs
// This line corresponds to the error you were seeing
router.get("/", auditController.getAllAuditLogs);

module.exports = router;
