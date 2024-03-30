export type FieldType = string | number | boolean | Array<FieldType> | null;

export type Field = {
  id: number;
  expectedAnswer?: expectedAnswer;
  isUserTypeField?: boolean;
  question?: string;
  name: string;
  label: string;
  type: string;
  regex?: string;
  required: boolean;
  private?: boolean;
  matchingField?: string;
};

export type expectedAnswer = Array<{
  value: string;
  as: number | string | boolean;
}>;
