import validate from "../../../../src/lib/utils/input-validators/userID";
import errors from "../../../../src/lib/errors/util/input-validation";
import errorEnums from "../../../../src/lib/enums/error/util/input-validation";

import { v4 as uuidGenerator } from "uuid";

test("ensuring it determines a valid input string as valid", () => {
  const validInputs = [
    uuidGenerator(),
    uuidGenerator(),
    uuidGenerator(),
    uuidGenerator(),
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
    null,
    undefined,
    "not valid",
    "1859571240NOTVALID",
    "",
    " ",
    "            ",
    12365632,
    3,
    "$",
  ];
  let invalidAcc = 0;

  for (const input of invalidInputs) {
    try {
      validate(input);
    } catch (error) {
      expect(error).toBeInstanceOf(errors.InputValidationError);
      expect(error.message).toEqual(errorEnums.USER_ID);
      invalidAcc++;
    }
  }

  expect(invalidAcc).toEqual(invalidInputs.length);
});
