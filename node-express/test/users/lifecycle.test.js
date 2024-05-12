import { config } from "dotenv";
config();

import supertest from "supertest";

import testServer from "../testServer";
import webToken from "../../src/lib/utils/web-token/webToken";
import dataManagementApis from "../../src/lib/utils/data-management/dataManagementApis";

//delete
describe("Deleting a user: DELETE /users/:id", () => {
  test("invalid input", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation

    const id = null;

    await supertest(testServer).delete(`/users/${id}`).expect(400);
  });

  test("valid id", async () => {
    const id = "4bc575b7-93ba-41bf-b08d-4fddb355afb4",
      username = "validUsername",
      password = "password";

    await dataManagementApis.queryNoReturn(
      `
        INSERT INTO users (user_id, email_username, pw)
        VALUES ($1, $2, $3)
        `,
      [id, username, password]
    );

    await supertest(testServer).delete(`/users/${id}`).expect(204);

    const userResult = await dataManagementApis.oneOrNone(
      `
        SELECT user_id
        FROM users
        WHERE user_id = $1
        `,
      [id]
    );

    const sessionResult =
      (await dataManagementApis.query(
        `
        SELECT user_id
        FROM user_sessions
        WHERE user_id = $1
        `,
        [id]
      ).length) === 0; //needs to return an array that is completely empty

    expect(userResult || sessionResult).toBeFalsy(); // both have to be falsy, meaning all related records are deleted
  });
});

//initialize
describe("Initializing a user: POST /users", () => {
  test("no inputs", async () => {
    await supertest(testServer).post("/users").expect(400);
  });

  test("invalid input: emailUsername", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation

    const emailUsername = "invalid emailUsername",
      password = "Password123!";

    await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(400);
  });

  test("invalid input: password", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation

    const emailUsername = "validEmailUsername",
      password = "invalid password";

    await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(400);
  });

  test("existing user", async () => {
    const id = "4bc575b7-93ba-41bf-b08d-4fddb355afb4",
      emailUsername = "validEmailUsername",
      password = "Password123!";

    await dataManagementApis.queryNoReturn(
      `INSERT INTO users (user_id, email_username, pw)
       VALUES ($1, $2, $3)
    `,
      [id, emailUsername, password]
    );

    await supertest(testServer)
      .post("/users")
      .send({
        emailUsername,
        password: "NewPassw0rd!",
      })
      .expect(409);

    await supertest(testServer).delete(`/users/${id}`).expect(204);
  });

  test("valid inputs", async () => {
    const emailUsername = "validEmailUsername",
      password = "Password123!";

    const res = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    await supertest(testServer).delete(`/users/${res.body.id}`).expect(204);
  });
});

//authenticate
describe("Authenticating a user: POST /users/authenticate", () => {
  test("invalid input: emailUsername", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation

    const emailUsername = "validEmailUsername",
      password = "Password123!";

    const res = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    await supertest(testServer)
      .post("/users/authenticate")
      .send({ emailUsername: "invalid emailUsername", password })
      .expect(400);

    await supertest(testServer).delete(`/users/${res.body.id}`).expect(204);
  });

  test("invalid input: password", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation

    const emailUsername = "validUsername",
      password = "Password123!";

    const res = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    await supertest(testServer)
      .post("/users/authenticate")
      .send({ emailUsername, password: "invalid password" })
      .expect(400);

    await supertest(testServer).delete(`/users/${res.body.id}`).expect(204);
  });

  test("valid input", async () => {
    const emailUsername = "validUsername",
      password = "Password123!";

    const res = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    await supertest(testServer)
      .post("/users/authenticate")
      .send({ emailUsername, password })
      .expect(201);

    await supertest(testServer).delete(`/users/${res.body.id}`).expect(204);

    await supertest(testServer)
      .post("/users/authenticate")
      .send({ emailUsername, password })
      .expect(404); //ensures the user is deleted, which should return a 'not found' code
  });
});

//verify
describe("Verifying a user: POST /users/verify", () => {
  test("invalid input", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation

    await supertest(testServer)
      .post("/users/verify")
      .send({ token: "invalid token" })
      .expect(406);
  });

  test("invalid input: token expired", async () => {
    //essentially an empty token that only contains the exp property set to an expired time
    const expiredToken = webToken.sign({
      exp: Math.floor(Date.now() / 1000) - 10, //exp set to 10 minutes prior to the time of code execution
    });

    await supertest(testServer)
      .post("/users/verify")
      .send({ token: expiredToken })
      .expect(406);
    //should return a token error, since jsonwebtoken
    //automatically throws if the token is expired
  });

  test("invalid token: user does not exist", async () => {
    const emailUsername = "validEmailUsername",
      password = "Password123!";

    const createUserRes = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    const authenticateRes = await supertest(testServer)
      .post("/users/authenticate")
      .send({
        emailUsername,
        password,
      })
      .expect(201);

    await supertest(testServer)
      .delete(`/users/${createUserRes.body.id}`)
      .expect(204); //cleanup

    //executes after the db has been wiped, hence the token is invalid
    //since the user is not found
    await supertest(testServer)
      .post("/users/verify")
      .send({ token: authenticateRes.body.token })
      .expect(404);
  });

  test("valid token", async () => {
    const emailUsername = "validEmailUsername",
      password = "Password123!";

    const createUserRes = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    const authenticateRes = await supertest(testServer)
      .post("/users/authenticate")
      .send({
        emailUsername,
        password,
      })
      .expect(201);

    //two verify requests to make sure that verify works on a token produced by an
    //authentication as well as a token produced by a previous verification
    const verifyRes = await supertest(testServer)
      .post("/users/verify")
      .send({ token: authenticateRes.body.token })
      .expect(201);

    await supertest(testServer)
      .post("/users/verify")
      .send({ token: verifyRes.body.newToken })
      .expect(201);

    await supertest(testServer)
      .delete(`/users/${createUserRes.body.id}`)
      .expect(204); //cleanup

    await supertest(testServer)
      .post("/users/verify")
      .send({ token: authenticateRes.body.token })
      .expect(404);
    //making sure the original token is not valid
    //because the third party does not exist
  });
});

//compare passwords
describe("Compare a supplied password to a stored password: POST /users/password", () => {
  test("invalid input: id ", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation

    const id = "invalid id",
      password = "Password123!";

    await supertest(testServer)
      .post("/users/password")
      .send({ userID: id, password })
      .expect(400);
  });

  test("invalid input: password", async () => {
    //unit test for input validation will handle the edge cases,
    //just need to check error code propagation

    const id = "4bc575b7-93ba-41bf-b08d-4fddb355afb4",
      password = "invalid password";

    await supertest(testServer)
      .post("/users/password")
      .send({ userID: id, password })
      .expect(400);
  });

  test("user does not exist", async () => {
    const id = "4bc575b7-93ba-41bf-b08d-4fddb355afb4",
      password = "Password123!";

    await supertest(testServer)
      .post("/users/password")
      .send({ userID: id, password })
      .expect(404);
  });

  test("valid inputs", async () => {
    const emailUsername = "validEmailUsername",
      password = "Password123!";

    const initRes = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    await supertest(testServer)
      .post("/users/password")
      .send({ userID: initRes.body.id, password })
      .expect(200)
      .then((res) => {
        const { matches } = res.body;

        expect(matches).toBeTruthy();
      });

    await supertest(testServer)
      .post("/users/password")
      .send({ userID: initRes.body.id, password: "DiffPassword123!" })
      .expect(200)
      .then((res) => {
        const { matches } = res.body;

        expect(matches).toBeFalsy();
      });

    await supertest(testServer).delete(`/users/${initRes.body.id}`).expect(204);
  });
});

//compare emailUsernames
describe("Compare a supplied emailUsername to a stored emailUsername: POST /users/email-username", () => {});

//update password
describe(`Take a supplied password and overwrite the 
password stored corres to the user: PUT /users/password`, () => {});

//update emailUsername
describe(`Take a supplied emailUsername and overwrite the
emailUsername stored corres to the user: PUT /users/email-username`, () => {});
