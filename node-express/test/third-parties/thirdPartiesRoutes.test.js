import createServer from "../../root/createServer";
import supertest from "supertest";

const testServer = createServer();

test("Creation of a generic third-party origin: POST /third-parties", () => {
  it("should return an error: invalid property", async () => {
    supertest(testServer)
      .post("/third-parties")
      .send({
        badProperty: null,
      })
      .expect(500);
  });
});
