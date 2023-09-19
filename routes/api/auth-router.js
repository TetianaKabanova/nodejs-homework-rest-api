import express from "express";
import authController from "../../controllers/auth-controller.js";
import * as userSchema from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchema.userSignUpSchema);
const userSignInValidate = validateBody(userSchema.userSignInSchema);
const userUpdateSubscriptionValidate = validateBody(
  userSchema.userUpdateSubscriptionSchema
);

authRouter.post("/registre", userSignUpValidate, authController.signUp);
authRouter.post("/login", userSignInValidate, authController.signIn);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.signOut);
authRouter.patch(
  "/",
  authenticate,
  userUpdateSubscriptionValidate,
  authController.updateSubscription
);

export default authRouter;
