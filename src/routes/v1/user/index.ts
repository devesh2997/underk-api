import { Router } from "express";
import { UserAuthController } from "../../../controllers/user/auth.controller";

const router = Router();

router.post("/auth/findUser", UserAuthController.findUser);
router.post("/auth/sendOtp", UserAuthController.sendOtp);
router.post("/auth/verifyOtp", UserAuthController.verifyOtp);
router.post("/auth/createUser", UserAuthController.createUser);
router.post("/auth/login", UserAuthController.login);
router.post("/auth/loginWithGoogle", UserAuthController.loginWithGoogle);

export default router;
