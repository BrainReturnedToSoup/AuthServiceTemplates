import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

import { promisify } from "util";
const promiseRandomBytes = promisify(randomBytes);

import {
  EncryptError,
  DecryptError,
} from "../../../errors/util/encrypt-decrypt";

async function random16Bytes() {
  return await promiseRandomBytes(16);
}

function encryptBuilder(keyHex) {
  return async function encrypt(string) {
    try {
      const ivBuffer = await random16Bytes(),
        keyBuffer = Buffer.from(keyHex, "hex"),
        ivHex = ivBuffer.toString("hex");

      const cipher = createCipheriv("aes-256-ctr", keyBuffer, ivBuffer);

      let encrypted = cipher.update(string, "utf8", "hex");
      encrypted += cipher.final("hex");

      return encrypted + ":" + ivHex;
    } catch (error) {
      throw new EncryptError(error.message);
    }
  };
}

function decryptBuilder(keyHex) {
  return async function decrypt(hexString) {
    try {
      const [cipherText, ivHex] = hexString.split(":");

      const ivBuffer = Buffer.from(ivHex, "hex"),
        keyBuffer = Buffer.from(keyHex, "hex");

      const decipher = createDecipheriv("aes-256-ctr", keyBuffer, ivBuffer);

      let decrypted = decipher.update(cipherText, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw new DecryptError(error.message);
    }
  };
}

export { encryptBuilder, decryptBuilder };
