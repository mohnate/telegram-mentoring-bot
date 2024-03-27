import { Field } from "types/field";
import { UtilsFunction } from "types/utils";
import profile from "../config/profile.json";

const getFields: UtilsFunction<void, Field[]> = () => {
  const commonFields: Field[] = profile.fields;
  const mentorFields: Field[] = profile.mentorFields;
  const menteeFields: Field[] = profile.menteeFields;
  return [...commonFields, ...mentorFields, ...menteeFields];
};

export default getFields;
