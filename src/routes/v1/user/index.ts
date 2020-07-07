import { Router } from "express";
import { UserAuthController } from "../../../controllers/user/auth.controller";
import { WishlistController } from "../../../controllers/user/wishlist.controller";

const router = Router();

router.post("/auth/findUser", UserAuthController.findUser);
router.post("/auth/sendOtp", UserAuthController.sendOtp);
router.post("/auth/verifyOtp", UserAuthController.verifyOtp);
router.post("/auth/createUser", UserAuthController.createUser);
router.post("/auth/login", UserAuthController.login);
router.post("/auth/loginWithGoogle", UserAuthController.loginWithGoogle);

router.get("/wishlist", WishlistController.get);
router.post("/wishlist", WishlistController.create);
router.delete("/wishlist", WishlistController.delete);
router.post("/wishlist/product", WishlistController.addProducts);
router.delete("/wishlist/product", WishlistController.deleteProducts);

export default router;
