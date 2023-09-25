import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import * as contactSchema from "../../models/Contact.js";
import { validateBody } from "../../decorators/index.js";
import { isValidId, authenticate, upload } from "../../middlewares/index.js";

const contactAddValidate = validateBody(contactSchema.contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(
  contactSchema.contactUpdateFavoriteSchema
);

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);
contactsRouter.get("/:id", isValidId, contactsController.getById);

// upload.fields([{name: "poster", maxCount: 1}]) - кілька полів
// upload.array("poster", 8) - в одному полі кілька файлів
contactsRouter.post(
  "/",
  upload.single("avatar"),
  contactAddValidate,
  contactsController.add
);
contactsRouter.delete("/:id", isValidId, contactsController.deleteById);
contactsRouter.put(
  "/:id",
  isValidId,
  contactAddValidate,
  contactsController.updateById
);
contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  contactUpdateFavoriteValidate,
  contactsController.updateStatusContact
);

export default contactsRouter;
