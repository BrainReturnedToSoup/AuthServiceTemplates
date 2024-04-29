import bcrypt from "bcrypt";

export default async function hashPassword(password) {
  return await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
}
