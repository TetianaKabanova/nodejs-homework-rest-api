import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

const { DB_HOST_TEST, PORT, JWT_SECRET } = process.env;

describe("test signin route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {});

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test signin with correct data", async () => {
    const signinData = {
      email: "maks@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send(signinData);

    expect(statusCode).toBe(401);

    if (body.user) {
      const { _id } = body.user;
      const payload = {
        id: _id,
      };

      const expectedToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
      expect(body.token).toBe(expectedToken);

      expect(typeof body.token).toBe("string");
      expect(body.user.email).toBe(signinData.email);
      expect(typeof body.user.email).toBe("string");
      expect(body.user.subscription).toBe("starter");
      expect(typeof body.user.subscription).toBe("string");
    }
  });
});
