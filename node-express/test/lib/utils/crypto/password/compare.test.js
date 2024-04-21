import comparePasswords from "../../../../../src/lib/utils/crypto/password/compare";
import bcrypt from "bcrypt";

const mockPassword = "RandomP@ssw0rd";
const differentPassword = "differentPassword";
const hashedPassword = await bcrypt.hash(mockPassword, 10);

test("password matches hashed version of itself", async () => {
  expect(await comparePasswords(mockPassword, hashedPassword)).toBeTruthy();
});

test("different password does not match hashed version", async () => {
  expect(await comparePasswords(differentPassword, hashedPassword)).toBeFalsy();
});
