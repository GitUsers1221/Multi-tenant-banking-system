const pool = require("../db");

exports.getAllAccountTypes = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM account_types");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
