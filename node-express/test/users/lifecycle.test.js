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
        INSERT INTO Users (user_id, email_username, pw)
        VALUES ($1, $2, $3)
        `,
      [id, username, password]
    );

    await supertest(testServer).delete(`/users/${id}`).expect(204);
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
describe("Authenticating a user: POST /users/authenticate", () => {});

//verify
describe("Verifying a user: POST /users/verify", () => {});

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
