import createServer from "../../root/createServer";
import supertest from "supertest";

const testServer = createServer();

describe("Creation of a generic third-party origin: POST /third-parties", () => {
  test("should return an error: invalid property", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({
        badProperty: null,
      })
      .expect(500)
      .then((res) => {
        console.log("response: ", res);
      });
  });
});
