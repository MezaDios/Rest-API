"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/login', userController_1.userController.login);
        this.router.post('/addDebt', userController_1.userController.registerDebt);
        this.router.post('/addPayment', userController_1.userController.registerPayment);
        this.router.post('/registerUser', userController_1.userController.SignUp);
        this.router.post('/debtsByDate/', userController_1.userController.getDebtsByDate);
        this.router.post('/debtsByUSer/:id', userController_1.userController.getDebtsByUser);
        this.router.post('/paymentsByUser/:id', userController_1.userController.getPaymentsByUser);
        this.router.post('/totalDue/:id', userController_1.userController.getTotalDue);
        this.router.post('/Debtors', userController_1.userController.getDebtors);
        this.router.post('/generalDue', userController_1.userController.getGeneralDue);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
