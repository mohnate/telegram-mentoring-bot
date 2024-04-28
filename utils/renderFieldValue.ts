import { Field, FieldType } from "../types/field";
import { UtilsFunction } from "../types/utils";

type RenderFieldValueOptions = {
  fieldValue: FieldType;
  field: Field | null;
};

const renderFieldValue: UtilsFunction<RenderFieldValueOptions, string> = ({
  fieldValue,
  field,
}) => {
  if (!field) return "Field not found";
  if (field.expectedAnswer) {
    if (Array.isArray(field.expectedAnswer)) {
      if (Array.isArray(fieldValue)) {
        return fieldValue
          .map((value) => {
            const expectedAnswer = field.expectedAnswer?.find(
              (answer) => answer.as === value
            );
            return expectedAnswer
              ? expectedAnswer.value.toString()
              : value
              ? value.toString()
              : "Not set";
          })
          .join(", ");
      } else {
        const expectedAnswer = field.expectedAnswer?.find(
          (answer) => answer.as === fieldValue
        );
        return expectedAnswer
          ? expectedAnswer.value.toString()
          : fieldValue?.toString() || "Not set";
      }
    }
  }
  if (fieldValue === null || fieldValue === undefined) return "Not set";
  return fieldValue.toString();
};

export default renderFieldValue;
