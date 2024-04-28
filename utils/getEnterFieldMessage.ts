import { User } from "../db/entity/User";
import { UtilsFunction } from "../types/utils";
import { Field } from "../types/field";
import renderFieldValue from "./renderFieldValue";

type GetEnterFieldMessageOptions = {
  field: Field | null;
  user?: User | null;
  command?: string;
};

type GetEnterFieldMessageResponse = {
  response: string;
  options: {
    reply_markup: string;
  };
};

type Options = {
  reply_markup: {
    inline_keyboard: {
      text: string;
      callback_data: string;
    }[][];
  };
};

const getEnterFieldMessage: UtilsFunction<
  GetEnterFieldMessageOptions,
  GetEnterFieldMessageResponse
> = ({ field, user, command = "" }) => {
  const options: Options = {
    reply_markup: {
      inline_keyboard: [],
    },
  };
  if (!field)
    return {
      response: "Setup complete!",
      options: { reply_markup: "" },
    };
  const expectedAnswer = field.expectedAnswer;
  let message =
    "\n" +
    (field.question || `Please enter your ${field.label.toLowerCase()}:`);
  if (expectedAnswer) {
    if (Array.isArray(expectedAnswer))
      message += `\n\nPossible answers: ${expectedAnswer
        .map((e) => e.value)
        .join(
          ", "
        )}.\nPlease select one or multiple options by clicking the buttons below.`;
    // Group into rows of 3
    const rows = [];
    for (let i = 0; i < expectedAnswer.length; i += 3) {
      rows.push(
        expectedAnswer.slice(i, i + 3).map((e) => ({
          text: e.value,
          callback_data: command ? command + ":" + e.as.toString() : "",
        }))
      );
    }
    options.reply_markup.inline_keyboard = rows;
  } else {
    if (field.type === "stringArray")
      message += "\n\nSeparate multiple values with a comma (,).";
  }

  if (field.private)
    message +=
      "\n\nThis field is private. It will only be shared to the people you accept matches with.";

  let filled = false;
  if (user) {
    const value = user.profile[field.id];
    if (value && (!Array.isArray(value) || value.length)) {
      message += "\n\n";
      if (field.expectedAnswer && field.type === "stringArray")
        message += "Selected answers: ";
      else if (field.expectedAnswer) message += "Selected answer: ";
      else message += "Current value: ";
      message += renderFieldValue({
        fieldValue: value,
        field,
      });
      options.reply_markup.inline_keyboard.push([
        {
          text: "Next question",
          callback_data: command + ":next",
        },
      ]);
      filled = true;
    }
  }
  if (!field.required && !filled) {
    message += "\n\nThis field is optional.";
    options.reply_markup.inline_keyboard.push([
      {
        text: "Skip",
        callback_data: command + ":next",
      },
    ]);
  }
  const finalOptions = {
    reply_markup: JSON.stringify(options.reply_markup),
  };
  return { response: message, options: finalOptions };
};

export default getEnterFieldMessage;
