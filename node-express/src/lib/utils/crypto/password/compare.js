import bcrypt from "bcrypt";

export default async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
