import { randomBytes, createCipheriv } from "crypto";
import { promisify } from "util";

const promiseRandomBytes = promisify(randomBytes);

//12 byte IV is best practice to prevent IV collisions.
//Preventing this is crucial given a large vulnerability of GCM
//involves the case of reusing an IV for different pieces of data.
async function random12Bytes() {
  return await promiseRandomBytes(12);
}

//ommiting the return of the auth tag given that the data will be stored
//on a JWT token, which guarantees the integrity of its payload.
export default async function encrypt(string) {
  const ivBuffer = await random12Bytes(),
    keyBuffer = Buffer.from("SYM KEY GOES HERE", "utf-8");

  const ivHex = ivBuffer.toString("hex");

  const cipher = createCipheriv("aes-256-gcm", keyBuffer, ivBuffer);

  let encrypted = cipher.update(string, "utf-8", "hex");

  encrypted += cipher.final("hex");

  return encrypted + ":" + ivHex;
}
