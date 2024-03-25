import Joi from "joi";
import utilErrors from "../../errors/util";

const { InputValidationError, enums } = utilErrors;

//takes in an input string, and throws an error if the input string does not match
//the declared schema. This thrown error is handled in the controller catch block via the corresponding
//error handler.
export default function validate(inputString) {
  const schema = Joi.string().guid({ version: ["uuidv4"] });

  const { error } = schema.validate(inputString);

  if (error) throw new InputValidationError(enums.inputValidation.USER_ID);
}
