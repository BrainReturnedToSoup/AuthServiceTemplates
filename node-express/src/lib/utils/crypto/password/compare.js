import bcrypt from "bcrypt";

export default async function comparePasswords(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    
  }
}
