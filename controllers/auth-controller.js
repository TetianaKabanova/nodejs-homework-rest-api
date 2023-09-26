import User, { userUpdateSubscriptionSchema } from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";

const avatarsDir = path.resolve("public", "avatars");
const { JWT_SECRET } = process.env;

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw HttpError(409, "Email is already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await User.findByIdAndUpdate(id, { token });

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
  const user = await User.findByIdAndUpdate(_id, { token: "" });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  res.sendStatus(204);
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const { error } = userUpdateSubscriptionSchema.validate({ subscription });
  if (error) {
    throw HttpError(400, error.message);
  }
  const userUpdate = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );
  if (!userUpdate) {
    throw HttpError(404, "User not found");
  }
  res.json(userUpdate);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  try {
    await fs.rename(tempUpload, resultUpload);
    const avatar = await Jimp.read(resultUpload);
    await avatar.resize(250, 250).write(resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      status: "Success",
      code: 200,
      data: {
        result: { avatarURL },
      },
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
