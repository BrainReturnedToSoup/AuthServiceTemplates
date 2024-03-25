import Joi from "joi";
import utilErrors from "../../errors/util";

const { InputValidationError, enums } = utilErrors;

export default function validate(inputString) {
  const regexp = new RegExp(`^[a-zA-Z0-9_@]+$
  `); //Alphanumeric along with '@' and '_'

  const schema = Joi.string().length(60).pattern(regexp);

  const { error } = schema.validate(inputString);

  //uses DIP in order to decouple the app logic from the specific error objects thrown
  //by the JOI library.
  if (error)
    throw new InputValidationError(enums.inputValidation.THIRD_PARTY_NAME);
}
