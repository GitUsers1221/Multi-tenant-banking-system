const pool = require("../db");

exports.getAllLoans = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM loans");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getLoanById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM loans WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Loan not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createLoan = async (req, res, next) => {
  try {
    const { customer_id, amount, status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO loans (customer_id, amount, status) VALUES (?, ?, ?)",
      [customer_id, amount, status || 'Pending']
    );
    res.status(201).json({ 
      id: result.insertId, 
      customer_id, 
      amount, 
      status: status || 'Pending' 
    });
  } catch (err) {
    next(err);
  }
};

exports.updateLoan = async (req, res, next) => {
  try {
    const { customer_id, amount, status } = req.body;
    const [result] = await pool.query(
      "UPDATE loans SET customer_id = ?, amount = ?, status = ? WHERE id = ?",
      [customer_id, amount, status, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Loan not found" });
    res.json({ message: "Loan updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteLoan = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM loans WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Loan not found" });
    res.json({ message: "Loan deleted" });
  } catch (err) {
    next(err);
  }
};