import { config } from "dotenv";
config();

import createServer from "../../root/createServer";
import supertest from "supertest";

const testServer = createServer();

describe("Authenticating a third-party origin: /third-parties/authenticate", () => {
  test("not supplying a body", async () => {
    await supertest(testServer).post("/third-parties/authenticate").expect(400);
  });

  test("supplying an empty body", async () => {
    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({})
      .expect(400);
  });

  test("supplying a bad property", async () => {
    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({ badProperty: null })
      .expect(400);
  });

  test("supplying a single invalid value along with a valid value: invalid emailUsername", async () => {
    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({
        emailUsername: null,
        password: "Password123!",
        thirdPartyID: "eb8d33ca-38e0-4279-b25b-0d27305f736",
      })
      .expect(400);
  });

  test("supplying a single invalid value along with a valid value: invalid password", async () => {
    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({
        emailUsername: "validUsername123",
        password: null,
        thirdPartyID: "eb8d33ca-38e0-4279-b25b-0d27305f736",
      })
      .expect(400);
  });

  test("supplying a single invalid value along with a valid value: invalid password", async () => {
    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({
        emailUsername: "validUsername123",
        password: "Password123!",
        thirdPartyID: null,
      })
      .expect(400);
  });

  test("supplying valid values", async () => {
    const emailUsername = "validEmailUsername",
      password = "Password123!";

    await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    const res = await supertest(testServer)
      .post("/third-parties")
      .send({ name: "validName", uri: "https://example.com/test" })
      .expect(201);

    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({ emailUsername, password, thirdPartyID: res.body.id })
      .expect(201);
  });
});
