const pool = require("../db");

exports.getAllAccounts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.account_id AS id,
        c.name AS customer_name,
        at.type_name AS account_type,
        a.balance
      FROM accounts a
      JOIN customers c ON a.customer_id = c.customer_id
      JOIN account_types at ON a.account_type_id = at.account_type_id
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
exports.getAllCustomers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT customer_id AS id, name, age, gender
      FROM customers
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
exports.getCustomerById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM customers WHERE customer_id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Customer not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { name, age, gender } = req.body;
    const [result] = await pool.query(
      "INSERT INTO customers (name, age, gender) VALUES (?, ?, ?)",
      [name, age, gender]
    );
    res.status(201).json({ customer_id: result.insertId, name, age, gender });
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { name, age, gender } = req.body;
    const [result] = await pool.query(
      "UPDATE customers SET name = ?, age = ?, gender = ? WHERE customer_id = ?",
      [name, age, gender, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM customers WHERE customer_id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    next(err);
  }
};
