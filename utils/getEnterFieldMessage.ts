import { User } from "../db/entity/User";
import { UtilsFunction } from "../types/utils";
import { Field } from "../types/field";
import topics from "../config/topics.json";
import renderFieldValue from "./renderFieldValue";

type GetEnterFieldMessageOptions = {
  field: Field | null;
  user?: User | null;
};

const getEnterFieldMessage: UtilsFunction<
  GetEnterFieldMessageOptions,
  string
> = ({ field, user }) => {
  if (!field) return "Setup complete!";
  const expectedAnswer = field.expectedAnswer;
  let message =
    "\n" +
    (field.question || `Please enter your ${field.label.toLowerCase()}:`);
  if (expectedAnswer) {
    if (Array.isArray(expectedAnswer))
      message += `\n\nPossible answers:${expectedAnswer
        .map((e) => `\n- /${e.value}`)
        .join(", ")}`;
  } else {
    if (field.type === "stringArray")
      message += "\n\nSeparate multiple values with a comma (,).";
    if (field.type === "topics")
      message += `\n\nSeparate multiple topics with a comma (,).
Acceptable topics: ${topics.map((t) => t.name).join(", ")}`;
  }

  if (!field.required)
    message += "\n\nThis field is optional. Type /skip to skip.";

  if (user) {
    const value = user.profile[field.id];
    if (value)
      message += `\n\nCurrent value: ${
        ["topics", "stringArray"].includes(field.type) ? "" : "/"
      }${renderFieldValue({
        fieldValue: value,
        field,
      })}`;
  }
  return message;
};

export default getEnterFieldMessage;
