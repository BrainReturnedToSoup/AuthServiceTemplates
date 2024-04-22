import validate from "../../../../src/lib/utils/input-validators/thirdPartyURI";
import errors from "../../../../src/lib/errors/util/input-validation";
import errorEnums from "../../../../src/lib/enums/error/util/input-validation";

test("ensuring it determines a valid input string as valid", () => {
  const validInputs = [
    "https://example.com",
    "https://api.example.com/v1/resource",
    "https://subdomain.example.com/path/to/resource",
    "https://www.example.com?q=query",
    "https://example.com:8080",
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
    12365632,
    3,
    "$",
    "urn:oasis:names:specification:docbook:dtd:xml:4.1.2",
    "ftp://ftp.is.co.za/rfc/rfc1808.txt",
    "ldap://[2001:db8::7]/c=GB?objectClass?one",
    "",
    " ",
    "            ",
  ];
  let invalidAcc = 0;

  for (const input of invalidInputs) {
    try {
      validate(input);
    } catch (error) {
      expect(error).toBeInstanceOf(errors.InputValidationError);
      expect(error.message).toEqual(errorEnums.THIRD_PARTY_URI);
      invalidAcc++;
    }
  }

  expect(invalidAcc).toEqual(invalidInputs.length);
});
