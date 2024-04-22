import Joi from "joi";
import errors from "../../errors/util/input-validation";
import errorEnums from "../../enums/error/util/input-validation";
const { InputValidationError } = errors;

//takes in an input string, and throws an error if the input string does not match
//the declared schema. This thrown error is handled in the controller catch block via the corresponding
//error handler.
export default function validate(inputString) {
  //the regexp for a string that contains atleast one uppercase, one lowercase,
  //a number, a special character, and is inclusively between 12 and 20 characters long
  const regexp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  const schema = Joi.string().min(12).max(20).pattern(regexp).required();

  const { error } = schema.validate(inputString);

  //uses DIP in order to decouple the app logic from the specific error objects thrown
  //by the JOI library.
  if (error) throw new InputValidationError(errorEnums.PASSWORD);
}
