import { config } from "dotenv";
config();

import supertest from "supertest";

import testServer from "../testServer";
import webToken from "../../src/lib/utils/web-token/webToken";
import dataManagementApis from "../../src/lib/utils/data-management/dataManagementApis";

//delete
describe("Deleting a user: DELETE /users/:id", () => {
  test("invalid input: null", async () => {
    const id = null;

    await supertest(testServer).delete(`/users/${id}`).expect(400);
  });

  test("invalid input: random string", async () => {
    const id = "al9Sk@#iLwPQ"; //not a uuid

    await supertest(testServer).delete(`/users/${id}`).expect(400);
  });

  test("invalid input: uuid with a pre space", async () => {
    const id = " 4bc575b7-93ba-41bf-b08d-4fddb355afb4";

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
  test("not supplying a body", async () => {
    await supertest(testServer).post("/users").expect(400);
  });

  test("supplying an empty body", async () => {
    await supertest(testServer).post("/users").send({}).expect(400);
  });

  test("supplying a bad property: 'badProperty'", async () => {
    await supertest(testServer)
      .post("/users")
      .send({ badProperty: null })
      .expect(400);
  });

  test("supplying a single invalid value along with a valid value: emailUsername", async () => {
    const emailUsername = null,
      password = "Password123!";

    await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(400);
  });

  test("supplying a single invalid value along with a valid value: password", async () => {
    const emailUsername = "validUsername",
      password = null;

    await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(400);
  });

  test("constraint validation: emailUsername", async () => {
    const emailUsernames = [
        "short",
        "loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong",
        "invalid)",
        "invalid ",
        "!",
        " ",
        "",
      ],
      password = "Password123!";

    for (const emailUsername of emailUsernames) {
      await supertest(testServer)
        .post("/users")
        .send({ emailUsername, password })
        .expect(400);
    }
  });

  test("constraint validation: password", async () => {
    const emailUsername = "validUsername",
      passwords = [
        "Sh0rt!",
        "Looooooooooooooooooooooooooooooooooooong0!",
        "invalid",
        "INVALID",
        "Invalid)",
        "!0",
        " ",
        "",
      ];

    for (const password of passwords) {
      await supertest(testServer)
        .post("/users")
        .send({ emailUsername, password })
        .expect(400);
    }
  });

  test("supplying invalid values: existing user", async () => {
    const id = "4bc575b7-93ba-41bf-b08d-4fddb355afb4",
      emailUsername = "validUsername",
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

  test("supplying valid values", async () => {
    const emailUsername = "validUsername",
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
  test("invalid input: email", async () => {
    const emailUsername = "validUsername",
      password = "Password123!";

    const res = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    await supertest(testServer)
      .post("/users/authenticate")
      .send({ emailUsername: "invalid email", password })
      .expect(400);

    await supertest(testServer).delete(`/users/${res.body.id}`).expect(204);
  });

  test("invalid input: password", async () => {
    const emailUsername = "validUsername",
      password = "Password123!";

    const res = await supertest(testServer)
      .post("/users")
      .send({ emailUsername, password })
      .expect(201);

    await supertest(testServer)
      .post("/users/authenticate")
      .send({ emailUsername, password: "invalid" })
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
  test("invalid inputs", async () => {
    await supertest(testServer)
      .post("/users/verify")
      .send({ token: null })
      .expect(406);

    await supertest(testServer)
      .post("/users/verify")
      .send({ token: "" })
      .expect(406);

    await supertest(testServer)
      .post("/users/verify")
      .send({ token: " " })
      .expect(406);

    await supertest(testServer).post("/users/verify").send({}).expect(406);

    await supertest(testServer)
      .post("/users/verify")
      .send({ invalidProperty: null })
      .expect(406);

    await supertest(testServer)
      .post("/users/verify")
      .send({ token: 123 })
      .expect(406);

    await supertest(testServer).post("/users/verify").expect(406);
  });

  test("invalid token: expired", async () => {
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
describe("Compare a supplied password to a stored password: POST /users/password", () => {});

//compare emailUsernames
describe("Compare a supplied emailUsername to a stored emailUsername: POST /users/email-username", () => {});

//update password
describe(`Take a supplied password and overwrite the 
password stored corres to the user: PUT /users/password`, () => {});

//update emailUsername
describe(`Take a supplied emailUsername and overwrite the
emailUsername stored corres to the user: PUT /users/email-username`, () => {});
