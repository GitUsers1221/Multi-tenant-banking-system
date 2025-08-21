// console.log("lCtrl:", require("../controllers/loansController"));
// const express = require("express");
// const routerL = express.Router();
// const lCtrl = require("../controllers/loansController");
// routerL.get("/", lCtrl.getAllLoans);
// routerL.get("/:id", lCtrl.getLoanById);
// routerL.post("/", lCtrl.createLoan);
// routerL.put("/:id", lCtrl.updateLoan);
// routerL.delete("/:id", lCtrl.deleteLoan);
// module.exports = routerL;

const express = require("express");
const routerL = express.Router();
const lCtrl = require("../controllers/loansController");

routerL.get("/", lCtrl.getAllLoans);
routerL.get("/:id", lCtrl.getLoanById);
routerL.post("/", lCtrl.createLoan);
routerL.put("/:id", lCtrl.updateLoan);
routerL.delete("/:id", lCtrl.deleteLoan);

module.exports = routerL;
