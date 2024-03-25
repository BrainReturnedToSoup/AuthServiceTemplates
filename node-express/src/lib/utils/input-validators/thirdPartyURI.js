import Joi from "joi";
import utilErrors from "../../errors/util";

const { InputValidationError, enums } = utilErrors;

export default function validate(inputString) {
  const schema = Joi.string().dataUri();

  const { error } = schema.validate(inputString);

  if (error)
    throw new InputValidationError(enums.inputValidation.THIRD_PARTY_URI);
}
