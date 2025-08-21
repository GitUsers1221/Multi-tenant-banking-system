const express = require("express");
const routerB = express.Router();
const bCtrl = require("../controllers/banksController");
routerB.get("/", bCtrl.getAllBanks);
routerB.get("/:id", bCtrl.getBankById);
routerB.post("/", bCtrl.createBank);
routerB.put("/:id", bCtrl.updateBank);
routerB.delete("/:id", bCtrl.deleteBank);
module.exports = routerB;
