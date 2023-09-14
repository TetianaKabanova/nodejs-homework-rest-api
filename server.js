import app from "./app.js";

import mongoose from "mongoose";

// const DB_HOST =
//   "mongodb+srv://Tetiana:hyAwgdBbGf0iyjCo@cluster0.uql4gxm.mongodb.net/my-contacts?retryWrites=true&w=majority";

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
