import Joi from "joi";
import utilErrors from "../../errors/util/input-validation";

const { InputValidationError, enums } = utilErrors;

//takes in an input string, and throws an error if the input string does not match
//the declared schema. This thrown error is handled in the controller catch block via the corresponding
//error handler.
export default function validate(inputString) {
  const schema = Joi.string().email();

  const { error } = schema.validate(inputString);

  //uses DIP in order to decouple the app logic from the specific error objects thrown
  //by the JOI library.
  if (error)
    throw new InputValidationError(enums.inputValidation.EMAIL_USERNAME);
}
