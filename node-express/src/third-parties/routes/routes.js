import express from "express";

const router = express.Router();

router.post("/", "controller here");
/**
 * Initialize a third-party source.
 *
 * Expects:
 * - 'name' property and value in the request body.
 * - 'uri' property and value in the request body.
 *
 *
 * Returns:
 * - 'thirdpartyID' property with a generated UUID value in the response body.
 */

router.post("/authenticate", "controller here");
/**
 * Authenticate a third-party source to a specific user's resources.
 *
 * Expects:
 * - 'emailUsername' property and value in the request body.
 * - 'property' property and value in the request body.
 * - 'thirdpartyID' property and value in the request body.
 *
 *
 * Returns:
 * - 'token' property with a third-party token in the response body.
 */

router.post("/verify", "controller here");
/**
 * Verify a third-party source.
 *
 * Expects:
 * - 'token' property with an existing JWT token for third-parties in the request body.
 *
 * Returns:
 * - 'valid' property with a boolean value representing validity of the third-party source.
 */

router.delete("/:id", "controller here");
/**
 * Deletes a third-party source.
 *
 * Expects:
 * - third-party ID in the route parameters.
 *
 * Returns:
 * - nothing
 */

export default router;
