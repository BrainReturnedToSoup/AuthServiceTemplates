import Joi from "joi";
import errors from "../../errors/util/input-validation";
import errorEnums from "../../enums/error/util/input-validation";
const { InputValidationError } = errors;

//takes in an input string, and throws an error if the input string does not match
//the declared schema. This thrown error is handled in the controller catch block via the corresponding
//error handler.
export default function validate(inputString) {
  const schema = Joi.string().guid({ version: ["uuidv4"] });

  const { error } = schema.validate(inputString);

  if (error) throw new InputValidationError(errorEnums.inputValidation.USER_ID);
}
