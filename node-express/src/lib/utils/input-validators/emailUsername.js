import Joi from "joi";

//takes in an input string, and throws an error if the input string does not match
//the declared schema. This thrown error is handled in the controller catch block via the corresponding
//error handler.
export default function validate(inputString) {
  const schema = Joi.string().email();

  const { error } = schema.validate(inputString);

  if (error) {
    throw error;
  }
}
