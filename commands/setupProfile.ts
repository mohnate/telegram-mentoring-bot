import { Command, CommandInteraction } from "../types/commands";
import getEnterFieldMessage from "../utils/getEnterFieldMessage";
import addOngoingCommand from "../utils/addOngoingCommand";
import { OngoingCommand } from "../db/entity/OngoingCommands";
import clearChatOngoingCommandsForUser from "../utils/clearChatOngoingCommandsForUser";
import parseMessageField from "../utils/parseMessageField";
import getField from "../utils/getField";
import { UserRepository } from "../db";
import incrementOngoingCommand from "../utils/incrementOngoingCommand";
import getOrCreateUser from "../utils/getOrCreateUser";
import getUserAvailableFields from "../utils/getUserAvailableFields";
import endOngoingCommand from "../utils/endOngoingCommand";
import { User } from "../db/entity/User";
import { Field } from "../types/field";
import isWhitelistedMentor from "../utils/isWhitelistedMentor";
import TelegramBot, { Message } from "node-telegram-bot-api";
import getOngoingCommand from "../utils/getOngoingCommand";
import renderFieldValue from "../utils/renderFieldValue";

export const commandSettings: Command = {
  name: "setup_profile",
  regex: /\/setup_profile/,
  description: "Setup your profile",
  handler,
  help: "Edit your profile",
  onProgress,
  onButton,
};

async function handler(interaction: CommandInteraction) {
  const userId = interaction.telegramUser?.id;
  if (!userId) return "No telegram user found in interaction";
  clearChatOngoingCommandsForUser({ userId, chatId: interaction.chat.id });
  // Add user to db if not exists
  addOngoingCommand({
    command: "setup_profile",
    userId,
    chatId: interaction.chat.id,
  });
  const { response, options } = await getEnterFieldMessage({
    field: getField(0),
    command: "setup_profile",
  });
  return {
    response: `Let's setup your profile!
I will ask you a few questions to get to know you better.
There is not time limit, so take your time, you can always come back later.
You can stop at any time by typing /cancel
${response}`,
    options,
  };
}

async function onProgress(
  interaction: CommandInteraction,
  ongoingCommand: OngoingCommand
) {
  const fieldIndex = ongoingCommand.stepId;
  const user = await getOrCreateUser(ongoingCommand.userId);
  if (!user) return "User not found";
  const availableFields = getUserAvailableFields(user.isMentor);
  // Setup complete
  if (fieldIndex + 1 > availableFields.length - 1)
    return endSetup(ongoingCommand, user);
  const field = availableFields[fieldIndex];
  if (!field) return "Invalid field, please try again";
  if (interaction.content === "/skip") {
    return update(
      interaction,
      ongoingCommand,
      fieldIndex,
      user,
      availableFields
    );
  }
  const messageContent = interaction.content.startsWith("/")
    ? interaction.content.replace("/", "")
    : interaction.content;
  const fieldValue = parseMessageField({
    messageContent,
    field,
  });
  if (fieldValue === null)
    return "Invalid value, please try again, or cancel the setup using /cancel.";
  // Save field value
  if (field.isUserTypeField) {
    // If this is the field to determine if the user is a mentor
    // Check if the user is whitelisted
    user.isMentor = fieldValue as boolean;
    if (
      fieldValue &&
      process.env.ENABLE_WHITELIST === "true" &&
      !(await isWhitelistedMentor(interaction.telegramUser?.username))
    )
      return "You need to be whitelisted to be a mentor. Please contact an admin.";
  } else user.profile[field.id] = fieldValue;
  await UserRepository.save(user);
  return update(interaction, ongoingCommand, fieldIndex, user, availableFields);
}

async function onButton(value: string, message: Message, bot: TelegramBot) {
  const telegramUserId = message.chat.id;
  const chatId = message.chat.id;
  const ongoingCommand = await getOngoingCommand({
    userId: telegramUserId,
    chatId,
  });
  if (!ongoingCommand) return "No ongoing command found";
  const user = await getOrCreateUser(telegramUserId);
  if (!user) return "User not found";
  const fieldIndex = ongoingCommand.stepId;
  const availableFields = getUserAvailableFields(user.isMentor);
  // Setup complete
  if (value === "next") {
    if (fieldIndex + 1 > availableFields.length - 1)
      return endSetup(ongoingCommand, user);
    return update(
      { content: "", chat: message.chat, bot },
      ongoingCommand,
      fieldIndex,
      user,
      availableFields
    );
  }
  const field = availableFields[fieldIndex];
  if (!field) return "Invalid field for button, please try again";
  if (!field.expectedAnswer) return "Invalid field type";
  const topic = field.expectedAnswer?.find(
    (e) => e.as.toString() === value.toString()
  );
  if (!topic) return "Invalid response";
  // Save field value
  if (field.isUserTypeField) {
    // If this is the field to determine if the user is a mentor
    // Check if the user is whitelisted
    user.isMentor = topic.as as boolean;
    if (
      value &&
      process.env.ENABLE_WHITELIST === "true" &&
      !(await isWhitelistedMentor(message.from?.username))
    )
      return "You need to be whitelisted to be a mentor. Please contact an admin.";
  }
  if (field.type === "stringArray") {
    const fieldValueCheck = user.profile[field.id];
    if (!fieldValueCheck || !Array.isArray(fieldValueCheck))
      user.profile[field.id] = [];
    const fieldValue = user.profile[field.id] || [];
    if (Array.isArray(fieldValue)) {
      if (fieldValue.includes(topic.as))
        user.profile[field.id] = fieldValue.filter((e) => e !== topic.as);
      else user.profile[field.id] = [...fieldValue, topic.as];
    }
  } else user.profile[field.id] = topic.as;
  await UserRepository.save(user);
  if (field.type === "stringArray") {
    const { response, options } = await getEnterFieldMessage({
      field,
      user,
      command: "setup_profile",
    });
    bot.editMessageText(response, {
      chat_id: chatId,
      message_id: message.message_id,
      reply_markup: JSON.parse(options.reply_markup),
    });
    return "";
  } else
    return update(
      { content: topic.value, chat: message.chat, bot },
      ongoingCommand,
      fieldIndex,
      user,
      availableFields
    );
}

async function endSetup(ongoingCommand: OngoingCommand, user: User) {
  endOngoingCommand(ongoingCommand.id);
  let message =
    "Setup complete! You can now use the /view_profile command to view your profile and check if everything is correct. Also, you can use /help to discover the new commands you unlocked!";
  return message;
}

async function update(
  interaction: CommandInteraction,
  ongoingCommand: OngoingCommand,
  fieldIndex: number,
  user: User,
  availableFields: Field[]
) {
  // Update ongoing command
  incrementOngoingCommand({
    ongoingCommandId: ongoingCommand.id,
    chatId: interaction.chat.id,
  });
  return getEnterFieldMessage({
    field: availableFields[fieldIndex + 1],
    user,
    command: "setup_profile",
  });
}
