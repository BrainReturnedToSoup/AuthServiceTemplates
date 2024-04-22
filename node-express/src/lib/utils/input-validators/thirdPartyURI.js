import Joi from "joi";
import errors from "../../errors/util/input-validation";
import errorEnums from "../../enums/error/util/input-validation";
const { InputValidationError } = errors;

export default function validate(inputString) {
  const schema = Joi.string().dataUri();

  const { error } = schema.validate(inputString);

  if (error)
    throw new InputValidationError(errorEnums.THIRD_PARTY_URI);
}
