import { createDecipheriv } from "crypto";

//the supplied hex string should include the IV at the end of itself separated by a colon.
export default function decrypt(hexString) {
  const [cipherText, ivHex] = hexString.split(":");

  const ivBuffer = Buffer.from(ivHex, "hex"),
    keyBuffer = Buffer.from("SYM KEY GOES HERE", "utf-8");

  const decipher = createDecipheriv("aes-256-gcm", keyBuffer, ivBuffer);

  let decrypted = decipher.update(cipherText, "hex", "utf-8");

  decrypted += decipher.final("utf-8");

  return decrypted;
}
