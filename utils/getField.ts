import { Field } from "../types/field";
import { UtilsFunction } from "../types/utils";
import getFields from "./getFields";

const getField: UtilsFunction<number | string, Field | null> = (fieldId) => {
  const fields = getFields();
  const field = fields.find(
    (field) => field.id.toString() === fieldId.toString()
  );
  return field || null;
};

export default getField;
