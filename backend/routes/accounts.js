const express = require("express");
const router = express.Router();
const {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} = require("../controllers/accountsController");

router.get("/", getAllAccounts);
router.get("/:id", getAccountById);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;
