import { config } from "dotenv";
config();

import createServer from "../../root/createServer";
import supertest from "supertest";

const testServer = createServer();

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
      .expect(403);

    await supertest(testServer)
      .delete(`/third-parties/${res.body.id}`)
      .expect(204);
  });
});
