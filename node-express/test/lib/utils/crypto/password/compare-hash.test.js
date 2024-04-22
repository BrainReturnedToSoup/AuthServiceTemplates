import comparePasswords from "../../../../../src/lib/utils/crypto/password/compare";
import hashPassword from "../../../../../src/lib/utils/crypto/password/hash";

const mockPassword = "RandomP@ssw0rd";
const differentPassword = "differentPassword";

test("password matches hashed version of itself", async () => {
  const hash = await hashPassword(mockPassword),
    comparison = await comparePasswords(mockPassword, hash);

  expect(comparison).toBeTruthy();
});

test("different password does not match hashed version", async () => {
  const hash = await hashPassword(mockPassword),
    comparison = await comparePasswords(differentPassword, hash);

  expect(comparison).toBeFalsy();
});
