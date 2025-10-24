import express from "express";
import { registerController,loginController } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/validator.middleware.js";

const router = express.Router();

router.post('/register',
    registerValidator,
    registerController)
router.post('/login',
    loginValidator,
    loginController)

export default router;