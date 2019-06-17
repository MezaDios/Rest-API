import { Router } from 'express';

import { userController } from '../controllers/userController';

class UserRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    private config(): void {
        this.router.post('/login', userController.login);
        this.router.post('/addDebt', userController.registerDebt);
        this.router.post('/addPayment', userController.registerPayment);
        this.router.post('/registerUser', userController.SignUp);
        this.router.post('/debtsByDate/', userController.getDebtsByDate);
        this.router.post('/debtsByUSer/:id', userController.getDebtsByUser);
        this.router.post('/paymentsByUser/:id', userController.getPaymentsByUser);
        this.router.post('/totalDue/:id', userController.getTotalDue);
        this.router.post('/Debtors', userController.getDebtors);
        this.router.post('/generalDue', userController.getGeneralDue);
    }

}

const userRoutes = new UserRoutes();

export default userRoutes.router;