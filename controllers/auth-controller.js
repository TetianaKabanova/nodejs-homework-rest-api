import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    subscription: newUser.subscription,
    email: newUser.email,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password wrong");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });
  //   const decodedToken = jwt.decode(token);
  //   console.log(decodedToken);

  res.json({
    token,
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const signOut = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(_id, { token: "" });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(204);
  } catch (error) {
    throw HttpError(500, "Internal Server Error");
  }
};

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;

  const { error } = userUpdateSubscriptionSchema.validate({ subscription });
  if (error) {
    throw HttpError(400, error.message);
  }

  const userUpdated = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );

  if (!userUpdated) {
    throw HttpError(404, "User not found");
  }

  res.json(userUpdated);
};

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  updateSubscription: ctrlWrapper(updateSubscription),
};
