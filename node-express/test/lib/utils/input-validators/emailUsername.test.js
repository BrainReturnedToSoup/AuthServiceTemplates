import validate from "../../../../src/lib/utils/input-validators/emailUsername";
import errors from "../../../../src/lib/errors/util/input-validation";
import errorEnums from "../../../../src/lib/enums/error/util/input-validation";

test("ensuring it determines a valid input string as valid", () => {
  const validInputs = [
    "ValidCharsAndWithin35_.-",
    "thisisalsovalid123",
    "19345710452",
    "randomEmail@email.com",
    "SomeRand0m-User",
  ];
  let invalidAcc = 0;

  for (const input of validInputs) {
    try {
      validate(input);
    } catch (error) {
      expect(error).not.toBeInstanceOf(errors.InputValidationError);
      invalidAcc++;
    }
  }

  expect(invalidAcc).toEqual(0);
});

test("ensuring it determines invalid inputs as invalid", () => {
  const invalidInputs = [
    null,
    undefined,
    "",
    "short",
    "looooooooooooooooooooooooooooooooooooooooooooong",
    "invalidChar^",
    "invalidChar!",
    "<>><><><><><><><",
  ];
  let invalidAcc = 0;

  for (const input of invalidInputs) {
    try {
      validate(input);
    } catch (error) {
      expect(error).toBeInstanceOf(errors.InputValidationError);
      expect(error.message).toEqual(errorEnums.EMAIL_USERNAME);
      invalidAcc++;
    }
  }

  expect(invalidAcc).toEqual(invalidInputs.length);
});
