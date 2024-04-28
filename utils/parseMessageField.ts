import { Field, FieldType } from "types/field";
import { UtilsFunction } from "../types/utils";

type ParseMessageFieldOptions = {
  messageContent: string;
  field: Field;
};

const parseMessageField: UtilsFunction<ParseMessageFieldOptions, FieldType> = ({
  messageContent,
  field,
}) => {
  const expectedAnswer = field.expectedAnswer;
  if (expectedAnswer) {
    if (Array.isArray(expectedAnswer)) {
      const expectedValue = expectedAnswer.find(
        (e) => e.value === messageContent
      );
      if (expectedValue) return expectedValue.as;
      return null;
    }
  }
  if (field.regex) {
    const regex = new RegExp(field.regex);
    if (!regex.test(messageContent)) return null;
  }
  switch (field?.type) {
    case "string":
      return messageContent;
    case "number":
      return Number(messageContent) || null;
    case "boolean":
      return Boolean(messageContent === "true" || messageContent === "1");
    case "stringArray":
      return messageContent.split(",");
    default:
      return null;
  }
};

export default parseMessageField;
