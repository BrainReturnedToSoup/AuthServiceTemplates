import { config } from "dotenv";
config();

import createServer from "../../root/createServer";
import supertest from "supertest";

const testServer = createServer();

//initialize
describe("Creation of a generic third-party origin: POST /third-parties", () => {
  test("not supplying a body", async () => {
    await supertest(testServer).post("/third-parties").expect(400);
  });

  test("supplying an empty body", async () => {
    await supertest(testServer).post("/third-parties").send({}).expect(400);
  });

  test("supplying a bad property: 'badProperty'", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({
        badProperty: "name",
      })
      .expect(400);
  });

  test("supplying a single invalid value along with a valid value: invalid URI", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({ name: "validName", uri: null })
      .expect(400);
  });

  test("supplying a single invalid value along with a valid value: invalid name", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({ name: null, uri: "https://example.com/test" })
      .expect(400);
  });

  test("supplying a single valid property and value: name", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({ name: "validName" })
      .expect(400);
  });

  test("supplying a single valid property and value: uri", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({ uri: "https://example.com/test" })
      .expect(400);
  });

  test("supplying a blank string for both properties", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({ name: " ", uri: " " })
      .expect(400);
  });

  test("supplying valid values", async () => {
    const res = await supertest(testServer)
      .post("/third-parties")
      .send({ name: "validName", uri: "https://example.com/test" })
      .expect(201);

    await supertest(testServer)
      .post("/third-parties")
      .send({ name: "validName", uri: "https://example.com/test" })
      .expect(409);

    await supertest(testServer)
      .delete(`/third-parties/${res.body.id}`)
      .expect(204);
  });
});

//authenticate
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

    await supertest(testServer)
      .delete(`/third-parties/${res.body.id}`)
      .expect(204);

    await supertest(testServer).
  });
});

//verify
describe("Verifying a third-party origin: POST /third-parties/verify", () => {});

//delete
describe("Deleting a third-party origin: DELETE /third-parties:id", () => {});
