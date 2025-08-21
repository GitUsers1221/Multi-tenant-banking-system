// Import the database connection pool
const pool = require("../db");

/**
 * @desc    Get all audit log entries
 * @route   GET /api/audit
 * @access  Private (or Admin)
 */
const getAllAuditLogs = async (req, res) => {
  try {
    // Query to get all audit log entries
    const query = `SELECT log_id, table_name, record_id, action, changed_by, timestamp FROM audit_logs ORDER BY timestamp DESC`;

    const [rows] = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Failed to retrieve audit logs" });
  }
};

// Export the function so the router can use it
module.exports = {
  getAllAuditLogs,
};
