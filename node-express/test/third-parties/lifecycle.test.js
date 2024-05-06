import { config } from "dotenv";
config();

import supertest from "supertest";

import testServer from "../testServer";
import webToken from "../../src/lib/utils/web-token/webToken";
import dataManagementApis from "../../src/lib/utils/data-management/dataManagementApis";

//delete
describe("Deleting a third-party origin: DELETE /third-parties:id", () => {
  test("invalid id: null", async () => {
    const id = null;

    await supertest(testServer).delete(`/third-parties/${id}`).expect(400);
  });

  test("invalid id: random string", async () => {
    const id = "al9Sk@#iLwPQ"; //not a uuid

    await supertest(testServer).delete(`/third-parties/${id}`).expect(400);
  });

  test("invalid id: uuid with a pre space", async () => {
    const id = " 4bc575b7-93ba-41bf-b08d-4fddb355afb4";

    await supertest(testServer).delete(`/third-parties/${id}`).expect(400);
  });

  test("valid id", async () => {
    const id = "4bc575b7-93ba-41bf-b08d-4fddb355afb4",
      name = "validName",
      uri = "https://example.com/test";

    await dataManagementApis.queryNoReturn(
      `        
      INSERT INTO third_parties
    (
      third_party_id,
      third_party_name,
      third_party_uri
    )
    VALUES ($1, $2, $3)
    `,
      [id, name, uri]
    );
    //creates a third party instance, which this is done manually
    //to decouple from the model implementation, and to only worry about
    //the data within the DB.

    await supertest(testServer).delete(`/third-parties/${id}`).expect(204);
  });
});

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
      .expect(204); //cleanup
  });
});

//authenticate
describe("Authenticating a third-party origin: POST /third-parties/authenticate", () => {
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

    const thirdPartyName = "validName",
      thirdPartyURI = "https://example.com/test";

    const userRes = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    const thirdPartyRes = await supertest(testServer)
      .post("/third-parties")
      .send({ name: thirdPartyName, uri: thirdPartyURI })
      .expect(201);

    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({ emailUsername, password, thirdPartyID: thirdPartyRes.body.id })
      .expect(201);

    await supertest(testServer)
      .delete(`/third-parties/${thirdPartyRes.body.id}`)
      .expect(204); //cleanup

    await supertest(testServer).delete(`/users/${userRes.body.id}`).expect(204); //cleanup
  });
});

//verify
describe("Verifying a third-party origin: POST /third-parties/verify", () => {
  test("invalid inputs", async () => {
    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ token: null })
      .expect(406);

    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ token: "" })
      .expect(406);

    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ token: " " })
      .expect(406);

    await supertest(testServer)
      .post("/third-parties/verify")
      .send({})
      .expect(406);

    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ invalidProperty: null })
      .expect(406);

    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ token: 123 })
      .expect(406);

    await supertest(testServer).post("/third-parties/verify").expect(406);
  });

  test("invalid token: expired", async () => {
    //essentially an empty token that only contains the exp property set to an expired time
    const expiredToken = webToken.sign({
      exp: Math.floor(Date.now() / 1000) - 10, //exp set to 10 minutes prior to the time of code execution
    });

    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ token: expiredToken })
      .expect(406);
    //should return a token error, since jsonwebtoken
    //automatically throws if the token is expired
  });

  test("invalid token: user does not exist", async () => {
    const emailUsername = "validEmailUsername",
      password = "Password123!";

    const thirdPartyName = "validName",
      thirdPartyURI = "https://example.com/test";

    const createUserRes = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    const createThirdPartyRes = await supertest(testServer)
      .post("/third-parties")
      .send({ name: thirdPartyName, uri: thirdPartyURI })
      .expect(201);

    const authenticateRes = await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({
        emailUsername,
        password,
        thirdPartyID: createThirdPartyRes.body.id,
      })
      .expect(201);

    await supertest(testServer)
      .delete(`/third-parties/${createThirdPartyRes.body.id}`)
      .expect(204); //cleanup

    await supertest(testServer)
      .delete(`/users/${createUserRes.body.id}`)
      .expect(204); //cleanup

    //executes after the db has been wiped, hence the token is invalid
    //since the user is not found
    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ token: authenticateRes.body.token })
      .expect(404);
  });

  test("valid token", async () => {
    const emailUsername = "validEmailUsername",
      password = "Password123!";

    const thirdPartyName = "validName",
      thirdPartyURI = "https://example.com/test";

    const createUserRes = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    const createThirdPartyRes = await supertest(testServer)
      .post("/third-parties")
      .send({ name: thirdPartyName, uri: thirdPartyURI })
      .expect(201);

    const authenticateRes = await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({
        emailUsername,
        password,
        thirdPartyID: createThirdPartyRes.body.id,
      })
      .expect(201);

    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ token: authenticateRes.body.token })
      .expect(204);

    await supertest(testServer)
      .delete(`/third-parties/${createThirdPartyRes.body.id}`)
      .expect(204); //cleanup

    await supertest(testServer)
      .delete(`/users/${createUserRes.body.id}`)
      .expect(204); //cleanup
  });
});
