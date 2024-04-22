import validate from "../../../../src/lib/utils/input-validators/password";
import errors from "../../../../src/lib/errors/util/input-validation";
import errorEnums from "../../../../src/lib/enums/error/util/input-validation";

test("ensuring it determines a valid input string as valid", () => {
  const validInputs = [
    "ValidPassw0rd123!",
    "sIl*lP@qChI!0",
    "wIU*sl@!lEQ2IdE",
    "1294@lsoOpE&",
  ];

  for (const input of validInputs) {
    try {
      validate(input);
    } catch (error) {
      expect(error).not.toBeInstanceOf(errors.InputValidationError);
    }
  }
});

test("ensuring it determines invalid inputs as invalid", () => {
  const invalidInputs = [
    undefined,
    null,
    " ",
    "            ",
    "short",
    "loooooooooooooooooooooooooooong",
    "noNumbers!",
    "nocapital!0",
    "NoSpecialSymb0ls",
    "123456789",
    "123456789!",
    "invalidSymbol]",
    "invalidSymbol<",
    "invalidSymbol(",
    12365632,
    3,
  ];
  let invalidAcc = 0;

  for (const input of invalidInputs) {
    try {
      validate(input);
    } catch (error) {
      expect(error).toBeInstanceOf(errors.InputValidationError);
      expect(error.message).toEqual(errorEnums.PASSWORD);
      invalidAcc++;
    }
  }

  expect(invalidAcc).toEqual(invalidInputs.length);
});
