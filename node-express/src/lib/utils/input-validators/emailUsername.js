import Joi from "joi";
import errors from "../../errors/util/input-validation";
import errorEnums from "../../enums/error/util/input-validation";
const { InputValidationError } = errors;

//takes in an input string, and throws an error if the input string does not match
//the declared schema. This thrown error is handled in the controller catch block via the corresponding
//error handler.
export default function validate(inputString) {
  const schema = Joi.string()
    .min(8)
    .max(35)
    .pattern(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_.@-]+$/);

  const { error } = schema.validate(inputString);

  //uses DIP in order to decouple the app logic from the specific error objects thrown
  //by the JOI library.
  if (error || !inputString)
    throw new InputValidationError(errorEnums.EMAIL_USERNAME);
}
