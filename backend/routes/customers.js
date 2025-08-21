const express = require("express");
const routerC = express.Router();
const cCtrl = require("../controllers/customersController");

routerC.get("/", cCtrl.getAllCustomers);
routerC.get("/:id", cCtrl.getCustomerById);
routerC.post("/", cCtrl.createCustomer);
routerC.put("/:id", cCtrl.updateCustomer);
routerC.delete("/:id", cCtrl.deleteCustomer);

module.exports = routerC;
