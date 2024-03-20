import express from "express";

import verify from "../controllers/verify/verify";
import update from "../controllers/update/update";
import initialize from "../controllers/initialize/initialize";
import compare from "../controllers/compare/compare";
import authenticate from "../controllers/authenticate/authenticate";
import deleteUser from "../controllers/delete/delete";

const router = express.Router();

router.post("/", initialize);
/**
 * Initialize a new user.
 *
 * Expects:
 * - 'email-username' property and value in the request body.
 * - 'password' property and value in the request body.
 *
 * Returns:
 * - 'userID' property with a generated UUID value in the response body.
 */

router.post("/authenticate", authenticate);
/**
 * Authenticate a user.
 *
 * Expects:
 * - 'email-username' property and value in the request body.
 * - 'password' property and value in the request body.
 *
 * Returns:
 * - 'token' property with a JWT token in the response body.
 */

router.post("/verify", verify);
/**
 * Verify an existing user.
 *
 * Expects:
 * - 'token' property with an existing JWT in the request body.
 *
 * Returns:
 * - 'newToken' property with a refreshed JWT in the request body.
 *   'userID' property with the corresponding user ID associated with the token in the request body.
 */

router.post("/password", compare.password);
/**
 * Validate password match.
 *
 * Expects:
 *   'userID' property and value in the request body.
 * - 'password' property and value in the request body.
 *
 * Returns:
 * - 'matches' property with a boolean value in the request body.
 */

router.post("/email-username", compare.emailUsername);
/**
 * Validate 'email-username' match.
 *
 * Expects:
 *   'userID' property and value in the request body.
 * - 'emailUsername' property and value in the request body.
 *
 * Returns:
 * - 'matches' property with a boolean value in the request body.
 */

router.put("/password", update.password);
/**
 * Update password.
 *
 * Expects:
 *   'userID' property and value in the request body.
 * - 'newPassword' property and value in the request body
 *
 * Returns:
 * - nothing
 */

router.put("/email-username", update.emailUsername);
/**
 * Update 'email-username' of a user.
 *
 * Expects:
 *   'userID' property and value in the request body.
 * - 'newEmailUsername' property and value in the request body
 *
 * Returns:
 * - nothing
 */

router.delete("/:id", deleteUser);
/**
 * Deletes a user.
 *
 * Expects:
 * - user ID in the route parameters.
 *
 * Returns:
 * - nothing
 */

export default router;
