import { config } from "dotenv";
config();

import supertest from "supertest";

import testServer from "../testServer";
import webToken from "../../src/lib/utils/web-token/webToken";
import dataManagementApis from "../../src/lib/utils/data-management/dataManagementApis";

//delete
describe("Deleting a third-party origin: DELETE /third-parties:id", () => {
  test("invalid id: null", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation
    const id = null;

    await supertest(testServer).delete(`/third-parties/${id}`).expect(400);
  });

  test("valid id", async () => {
    const id = "4bc575b7-93ba-41bf-b08d-4fddb355afb4",
      name = "validName",
      uri = "https://example.com/test";

    //creates a third party instance which this is done manually
    //to decouple from the model implementation, and to only worry about
    //the data within the DB.
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

    await supertest(testServer).delete(`/third-parties/${id}`).expect(204);

    const thirdPartyResult = await dataManagementApis.oneOrNone(
      `
      SELECT third_party_id
      FROM third_parties
      WHERE third_party_id = $1
      `,
      [id]
    );

    const sessionResult =
      (await dataManagementApis.query(
        `
      SELECT third_party_id
      FROM third_parties
      WHERE third_party_id = $1
      `,
        [id]
      ).length) === 0; //needs to return an array that is completely empt

    expect(thirdPartyResult || sessionResult).toBeFalsy(); // both have to be falsy, meaning all related records are deleted
  });
});

//initialize
describe("Creation of a generic third-party origin: POST /third-parties", () => {
  test("no inputs", async () => {
    await supertest(testServer).post("/third-parties").expect(400);
  });

  test("invalid input: URI", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({ name: "validName", uri: null })
      .expect(400);
  });

  test("invalid input: name", async () => {
    await supertest(testServer)
      .post("/third-parties")
      .send({ name: null, uri: "https://example.com/test" })
      .expect(400);
  });

  test("existing third-party", async () => {
    //ADD LOGIC HERE
  });

  test("valid inputs", async () => {
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
  test("no inputs", async () => {
    await supertest(testServer).post("/third-parties/authenticate").expect(400);
  });

  test("invalid input: emailUsername", async () => {
    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({
        emailUsername: null,
        password: "Password123!",
        thirdPartyID: "eb8d33ca-38e0-4279-b25b-0d27305f736",
      })
      .expect(400);
  });

  test("invalid input: password", async () => {
    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({
        emailUsername: "validUsername123",
        password: null,
        thirdPartyID: "eb8d33ca-38e0-4279-b25b-0d27305f736",
      })
      .expect(400);
  });

  test("invalid input: id", async () => {
    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({
        emailUsername: "validUsername123",
        password: "Password123!",
        thirdPartyID: null,
      })
      .expect(400);
  });

  test("valid inputs", async () => {
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

    await supertest(testServer)
      .post("/third-parties/authenticate")
      .send({ emailUsername, password, thirdPartyID: thirdPartyRes.body.id })
      .expect(404);
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
      .send({ token: "invalid input" })
      .expect(406);

    await supertest(testServer).post("/third-parties/verify").expect(406);
  });

  test("expired token", async () => {
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

  test("user does not exist", async () => {
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

    await supertest(testServer)
      .post("/third-parties/verify")
      .send({ token: authenticateRes.body.token })
      .expect(404);
    //making sure the original token is not valid
    //because the third party does not exist
  });
});
