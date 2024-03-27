import { Field, FieldType } from "types/field";
import { UtilsFunction } from "../types/utils";
import topics from "../config/topics.json";

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
    case "topics":
      return messageContent.split(",").map((topic) => {
        const reducedTopic = topic.trim().toLowerCase();
        const topicId = topics.findIndex((t) => t.name === reducedTopic);
        return topicId === -1 ? null : topicId;
      });
    default:
      return null;
  }
};

export default parseMessageField;
