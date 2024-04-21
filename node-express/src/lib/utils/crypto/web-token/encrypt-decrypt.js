import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

import { promisify } from "util";
const promiseRandomBytes = promisify(randomBytes);

import {
  EncryptError,
  DecryptError,
} from "../../../errors/util/encrypt-decrypt";

async function random12Bytes() {
  return await promiseRandomBytes(12);
}

function encryptBuilder(key) {
  return async function encrypt(string) {
    try {
      const ivBuffer = await random12Bytes(),
        keyBuffer = Buffer.from(key, "utf-8"),
        ivHex = ivBuffer.toString("hex");

      const cipher = createCipheriv("aes-256-gcm", keyBuffer, ivBuffer);

      let encrypted = cipher.update(string, "utf-8", "hex");
      encrypted += cipher.final("hex");

      return encrypted + ":" + ivHex;
    } catch (error) {
      throw new EncryptError(error.message);
    }
  };
}

function decryptBuilder(key) {
  return async function decrypt(hexString) {
    try {
      const [cipherText, ivHex] = hexString.split(":");

      const ivBuffer = Buffer.from(ivHex, "hex"),
        keyBuffer = Buffer.from(key, "utf-8");

      const decipher = createDecipheriv("aes-256-gcm", keyBuffer, ivBuffer);

      let decrypted = decipher.update(cipherText, "hex", "utf-8");
      decrypted += decipher.final("utf-8");

      return decrypted;
    } catch (error) {
      throw new DecryptError(error.message);
    }
  };
}

export { encryptBuilder, decryptBuilder };
