import express from "express";

import contactsController from "../../controllers/contacts-controller.js"

import contactsSchema from "../../schemas/contacts-schemas.js";

import { validateBody } from "../../decorators/index.js";

const contactAddValidate = validateBody(contactsSchema.contactAddSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", contactsController.getById);

contactsRouter.post("/", contactAddValidate, contactsController.add);

contactsRouter.delete(
  "/:id",
  contactAddValidate,
  contactsController.deleteById
);

contactsRouter.put("/:id", contactAddValidate, contactsController.updateById);

export default contactsRouter;
