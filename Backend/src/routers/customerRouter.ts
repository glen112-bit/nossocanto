import express from "express";
import customerController from "../controllers/customerController";


const router = express.Router();

router.get("/:id", customerController.getCustomer);

router.get("/", customerController.getCustomers);

router.post("/", customerController.postCustomer);

export default router;
