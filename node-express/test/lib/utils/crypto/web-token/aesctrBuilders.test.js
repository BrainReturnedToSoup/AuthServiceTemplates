import {
  encryptBuilder,
  decryptBuilder,
} from "../../../../../src/lib/utils/crypto/web-token/aesctrBuilders";

import {
  DecryptError,
  EncryptError,
} from "../../../../../src/lib/errors/util/encrypt-decrypt";

import crypto from "crypto";

const symKey = crypto.randomBytes(32).toString("hex");

const encrypt = encryptBuilder(symKey),
  decrypt = decryptBuilder(symKey);

test("ensuring the encrypt-decrypt apis work and mesh together", async () => {
  const stringToEncrypt = "random string 123";

  let encrypted, decrypted;

  try {
    encrypted = await encrypt(stringToEncrypt);
    decrypted = await decrypt(encrypted);
  } catch (error) {
    expect(error).toBeFalsy();
  }

  expect(stringToEncrypt).toEqual(decrypted);
});

test("ensuring the case that invalid inputs supplied to encrypt throws errors", async () => {
  const invalidInputs = [null, undefined, {}, [], 123];

  for (const input of invalidInputs) {
    let value = null;

    try {
      value = await encrypt(input);
    } catch (error) {
      expect(error).toBeInstanceOf(EncryptError);
      continue;
    }

    expect(value).toBe(null);
  }
});

test("ensuring the case that invalid inputs supplied to decrypt throws errors", async () => {
  const invalidInputs = [
    123,
    "",
    null,
    "invalid",
    "invalid:null",
    ":",
    ":key",
    undefined,
  ];

  for (const input of invalidInputs) {
    let value = null;

    try {
      value = await decrypt(input);
    } catch (error) {
      expect(error).toBeInstanceOf(DecryptError);
      continue;
    }

    expect(value).toBe(null);
  }
});
