const pool = require("../db");

async function getTransactionColumnNames() {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'transactions'`
  );
  const columnNames = rows.map((r) => r.COLUMN_NAME);

  const transactionTypeCol = columnNames.includes("transaction_type")
    ? "transaction_type"
    : columnNames.includes("transaction_type_id")
    ? "transaction_type_id"
    : columnNames.includes("type")
    ? "type"
    : null;

  const dateCol = columnNames.includes("transaction_date")
    ? "transaction_date"
    : columnNames.includes("created_at")
    ? "created_at"
    : null;

  return { transactionTypeCol, dateCol };
}

exports.getAllTransactions = async (req, res, next) => {
  try {
    const { transactionTypeCol, dateCol } = await getTransactionColumnNames();
    if (!transactionTypeCol) {
      return res.status(500).json({
        message: "transactions table missing transaction_type column",
      });
    }
    const effectiveDateCol = dateCol || "transaction_date";
    const typeSelect =
      transactionTypeCol === "transaction_type_id"
        ? `CASE t.${transactionTypeCol}
           WHEN 1 THEN 'Deposit'
           WHEN 2 THEN 'Withdrawal'
           WHEN 3 THEN 'Transfer'
           WHEN 4 THEN 'Payment'
           ELSE CAST(t.${transactionTypeCol} AS CHAR)
         END AS transaction_type`
        : `t.${transactionTypeCol} AS transaction_type`;

    const sql = `SELECT 
         t.transaction_id,
         t.account_id,
         ${typeSelect},
         t.amount,
         t.${effectiveDateCol} AS transaction_date
       FROM transactions t
       ORDER BY t.${effectiveDateCol} DESC`;

    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const { transactionTypeCol, dateCol } = await getTransactionColumnNames();
    const effectiveDateCol = dateCol || "transaction_date";
    const typeSelect =
      transactionTypeCol === "transaction_type_id"
        ? `CASE ${transactionTypeCol}
           WHEN 1 THEN 'Deposit'
           WHEN 2 THEN 'Withdrawal'
           WHEN 3 THEN 'Transfer'
           WHEN 4 THEN 'Payment'
           ELSE CAST(${transactionTypeCol} AS CHAR)
         END AS transaction_type`
        : `${transactionTypeCol} AS transaction_type`;
    const selectSql = `SELECT transaction_id, account_id, ${typeSelect}, amount, ${effectiveDateCol} AS transaction_date FROM transactions WHERE transaction_id = ?`;
    const [rows] = await pool.query(selectSql, [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { account_id, transaction_type, amount } = req.body;

    // Validate transaction type
    const validTypes = ["Deposit", "Withdrawal", "Transfer", "Payment"];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const { transactionTypeCol } = await getTransactionColumnNames();
    if (!transactionTypeCol) {
      return res.status(500).json({
        message: "transactions table missing transaction_type column",
      });
    }
    const typeValue =
      transactionTypeCol === "transaction_type_id"
        ? { Deposit: 1, Withdrawal: 2, Transfer: 3, Payment: 4 }[
            transaction_type
          ] ?? transaction_type
        : transaction_type;

    let insertSql;
    let params;
    if (descriptionCol) {
      insertSql = `INSERT INTO transactions (account_id, ${transactionTypeCol}, amount) VALUES (?, ?, ?)`;
      params = [account_id, typeValue, amount, description];
    } else {
      insertSql = `INSERT INTO transactions (account_id, ${transactionTypeCol}, amount) VALUES (?, ?, ?)`;
      params = [account_id, typeValue, amount];
    }
    const [result] = await pool.query(insertSql, params);

    res.status(201).json({
      transaction_id: result.insertId,
      account_id,
      transaction_type,
      amount,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { transaction_type, amount, description } = req.body;

    // Validate transaction type
    const validTypes = ["Deposit", "Withdrawal", "Transfer", "Payment"];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const { transactionTypeCol, descriptionCol } =
      await getTransactionColumnNames();
    if (!transactionTypeCol) {
      return res.status(500).json({
        message: "transactions table missing transaction_type column",
      });
    }
    const typeValue =
      transactionTypeCol === "transaction_type_id"
        ? { Deposit: 1, Withdrawal: 2, Transfer: 3, Payment: 4 }[
            transaction_type
          ] ?? transaction_type
        : transaction_type;

    let updateSql;
    let params;
    if (descriptionCol) {
      updateSql = `UPDATE transactions SET ${transactionTypeCol} = ?, amount = ?, description = ? WHERE transaction_id = ?`;
      params = [typeValue, amount, description, req.params.id];
    } else {
      updateSql = `UPDATE transactions SET ${transactionTypeCol} = ?, amount = ? WHERE transaction_id = ?`;
      params = [typeValue, amount, req.params.id];
    }
    const [result] = await pool.query(updateSql, params);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM transactions WHERE transaction_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};
