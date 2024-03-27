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
import { Field } from "types/field";

export const commandSettings: Command = {
  name: "setup_profile",
  regex: /\/setup_profile/,
  description: "Setup your profile",
  handler,
  help: "Edit your profile",
  onProgress,
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
  return `Let's setup your profile!
I will ask you a few questions to get to know you better.
There is not time limit, so take your time, you can always come back later.
You can stop at any time by typing /cancel
${getEnterFieldMessage({ field: getField(0) })}`;
}

async function onProgress(
  interaction: CommandInteraction,
  ongoingCommand: OngoingCommand
) {
  const fieldIndex = ongoingCommand.stepId;
  const user = await getOrCreateUser(ongoingCommand.userId);
  if (!user) return "User not found";
  const availableFields = getUserAvailableFields(user.isMentor);
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
  if (field.type === "topics" && Array.isArray(fieldValue)) {
    for (let index = 0; index < fieldValue.length; index++) {
      const value = fieldValue[index];
      if (value === null)
        return `Could not find topic ${
          messageContent.split(",")[index]
        }. Please try again.`;
    }
  }
  // Save field value
  if (fieldIndex > 0) user.profile[field.id] = fieldValue;
  else user.isMentor = fieldValue as boolean;
  await UserRepository.save(user);
  // Setup complete
  if (fieldIndex + 1 > availableFields.length - 1)
    return endSetup(ongoingCommand, user);
  return update(interaction, ongoingCommand, fieldIndex, user, availableFields);
}

async function endSetup(ongoingCommand: OngoingCommand, user: User) {
  endOngoingCommand(ongoingCommand.id);
  let message =
    "Setup complete! You can now use the /view_profile command to view your profile and check if everything is correct.";
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
  return getEnterFieldMessage({ field: availableFields[fieldIndex + 1], user });
}
