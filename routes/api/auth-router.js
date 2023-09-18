import express from "express";
import authController from "../../controllers/auth-controller.js";
import * as userSchema from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();
const userSignUpValidate = validateBody(userSchema.userSignUpSchema);
const userSignInValidate = validateBody(userSchema.userSignInSchema);
const userUpdateSubscrValidate = validateBody(
  userSchema.userUpdateSubscrSchema
);
authRouter.post("/registre", userSignUpValidate, authController.signUp);
authRouter.post("/login", userSignInValidate, authController.signIn);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.signOut);
authRouter.patch(
  "/",
  authenticate,
  userUpdateSubscrValidate,
  authController.updateSubscription
);

export default authRouter;
