import express from "express";
import authController from "../../controllers/auth-controller.js";
import * as userSchema from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";

const authRouter = express.Router();
const userSignUpValidate = validateBody(userSchema.userSignUpSchema);
const userSignInValidate = validateBody(userSchema.userSignInSchema);

authRouter.post("/registre", userSignUpValidate, authController.signUp);
authRouter.post("/login", userSignInValidate, authController.signIn);

export default authRouter;
