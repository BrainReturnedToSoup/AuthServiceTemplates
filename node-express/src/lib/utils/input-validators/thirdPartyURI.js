import Joi from "joi";
import errors from "../../errors/util/input-validation";
import errorEnums from "../../enums/error/util/input-validation";
const { InputValidationError } = errors;

export default function validate(inputString) {
  if (!inputString) throw new InputValidationError(errorEnums.THIRD_PARTY_URI);

  const schema = Joi.string()
    .uri({
      allowRelative: false, // Disable relative URIs altogether
      relativeOnly: false, // Allow both absolute and relative URIs
      scheme: ["https"], // Specify HTTPS as the only allowed scheme
    })
    .required();

  const { error } = schema.validate(inputString);

  if (error) throw new InputValidationError(errorEnums.THIRD_PARTY_URI);
}
