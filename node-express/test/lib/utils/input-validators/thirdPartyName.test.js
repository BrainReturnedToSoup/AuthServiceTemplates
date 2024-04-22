import validate from "../../../../src/lib/utils/input-validators/thirdPartyName";
import errors from "../../../../src/lib/errors/util/input-validation";
import errorEnums from "../../../../src/lib/enums/error/util/input-validation";

test("ensuring it determines a valid input string as valid", () => {
  const validInputs = [
    "Valid@name",
    "valid_name",
    "valid_Name",
    "validname",
    "validname1838759283479087509287349852893475692738486598",
    "VALIDNAME123@",
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
    "NOTVALID!",
    "NOTVALID123@_!",
    "NOTVALID#",
    "notvalid&",
    "          ",
    "",
    127598123,
  ];
  let invalidAcc = 0;

  for (const input of invalidInputs) {
    try {
      validate(input);
    } catch (error) {
      expect(error).toBeInstanceOf(errors.InputValidationError);
      expect(error.message).toEqual(errorEnums.THIRD_PARTY_NAME);
      invalidAcc++;
    }
  }

  expect(invalidAcc).toEqual(invalidInputs.length);
});
