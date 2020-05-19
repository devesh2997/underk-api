import { Router } from "express";
import { UserAuthController } from "../../../controllers/user/auth.controller";

const router = Router()

router.post('/sendOtp',UserAuthController.sendOtp)
router.post('/phoneLogin',UserAuthController.signInWithPhoneNumber)
router.post('/verifyEmailOtp',UserAuthController.verifyEmailOtpAndSignIn)

export default router