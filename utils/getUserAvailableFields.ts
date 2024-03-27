import { Field } from "types/field";
import { UtilsFunction } from "types/utils";
import profile from "../config/profile.json";

const getUserAvailableFields: UtilsFunction<boolean, Field[]> = (isMentor) => {
  const commonFields: Field[] = profile.fields;
  const mentorFields: Field[] = profile.mentorFields;
  const menteeFields: Field[] = profile.menteeFields;
  return isMentor
    ? [...commonFields, ...mentorFields]
    : [...commonFields, ...menteeFields];
};

export default getUserAvailableFields;
