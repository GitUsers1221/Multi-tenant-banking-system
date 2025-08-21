// Import the database connection pool
const pool = require("../db");

/**
 * @desc    Get all banks
 * @route   GET /api/banks
 * @access  Public
 */
const getAllBanks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM banks");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching banks:", error);
    res.status(500).json({ message: "Failed to retrieve banks" });
  }
};

/**
 * @desc    Get a single bank by its ID
 * @route   GET /api/banks/:id
 * @access  Public
 */
const getBankById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM banks WHERE id = ?", [id]);

    // Check if a bank with the given ID was found
    if (rows.length === 0) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching bank by ID:", error);
    res.status(500).json({ message: "Failed to retrieve the bank" });
  }
};

/**
 * @desc    Create a new bank
 * @route   POST /api/banks
 * @access  Public
 */
const createBank = async (req, res) => {
  try {
    // Destructure the expected fields from the request body
    const { name, branch, location, phone_number } = req.body;

    // Basic validation
    if (!name || !branch || !location) {
      return res
        .status(400)
        .json({ message: "Name, branch, and location are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO banks (name, branch, location, phone_number) VALUES (?, ?, ?, ?)",
      [name, branch, location, phone_number]
    );

    res.status(201).json({
      message: "Bank created successfully",
      bankId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating bank:", error);
    res.status(500).json({ message: "Failed to create the bank" });
  }
};

/**
 * @desc    Update an existing bank
 * @route   PUT /api/banks/:id
 * @access  Public
 */
const updateBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, branch, location, phone_number } = req.body;

    // Basic validation
    if (!name || !branch || !location) {
      return res
        .status(400)
        .json({ message: "Name, branch, and location are required" });
    }

    const [result] = await pool.query(
      "UPDATE banks SET name = ?, branch = ?, location = ?, phone_number = ? WHERE id = ?",
      [name, branch, location, phone_number, id]
    );

    // Check if any row was actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json({ message: "Bank updated successfully" });
  } catch (error) {
    console.error("Error updating bank:", error);
    res.status(500).json({ message: "Failed to update the bank" });
  }
};

/**
 * @desc    Delete a bank
 * @route   DELETE /api/banks/:id
 * @access  Public
 */
const deleteBank = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM banks WHERE id = ?", [id]);

    // Check if any row was actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json({ message: "Bank deleted successfully" });
  } catch (error) {
    console.error("Error deleting bank:", error);
    res.status(500).json({ message: "Failed to delete the bank" });
  }
};

// --- THIS IS THE MOST IMPORTANT PART ---
// Export all the controller functions so the router can use them
module.exports = {
  getAllBanks,
  getBankById,
  createBank,
  updateBank,
  deleteBank,
};
