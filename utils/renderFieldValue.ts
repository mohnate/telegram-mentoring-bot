import { Field, FieldType } from "../types/field";
import { UtilsFunction } from "../types/utils";
import topics from "../config/topics.json";

type RenderFieldValueOptions = {
  fieldValue: FieldType;
  field: Field | null;
};

const renderFieldValue: UtilsFunction<RenderFieldValueOptions, string> = ({
  fieldValue,
  field,
}) => {
  if (!field) return "Field not found";
  if (field.type === "topics") {
    const userTopics = fieldValue as number[];
    return userTopics
      .map((userTopic) => {
        return topics.find((topic) => topic.id === userTopic)?.label || "";
      })
      .join(", ");
  }
  if (field.expectedAnswer) {
    if (Array.isArray(field.expectedAnswer)) {
      const expectedAnswer = field.expectedAnswer?.find(
        (answer) => answer.as === fieldValue
      );
      return expectedAnswer
        ? expectedAnswer.value.toString()
        : fieldValue?.toString() || "Not set";
    }
  }
  if (fieldValue === null || fieldValue === undefined) return "Not set";
  return fieldValue.toString();
};

export default renderFieldValue;
