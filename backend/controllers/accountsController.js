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

exports.getAccountById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM accounts WHERE account_id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Account not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createAccount = async (req, res, next) => {
  try {
    const { customer_id, account_type_id, balance } = req.body;
    const [result] = await pool.query(
      "INSERT INTO accounts (customer_id, account_type_id, balance) VALUES (?, ?, ?)",
      [customer_id, account_type_id, balance]
    );
    res.status(201).json({
      account_id: result.insertId,
      customer_id,
      account_type_id,
      balance,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const { account_type_id, balance } = req.body;
    const [result] = await pool.query(
      "UPDATE accounts SET account_type_id = ?, balance = ? WHERE account_id = ?",
      [account_type_id, balance, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Account not found" });
    res.json({ message: "Account updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM accounts WHERE account_id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Account not found" });
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};
