import clearChatOngoingCommandsForUser from "../utils/clearChatOngoingCommandsForUser";
import { Command, CommandInteraction } from "../types/commands";

export const commandSettings: Command = {
  name: "cancel",
  regex: /\/cancel/,
  description: "",
  handler,
};

async function handler(interaction: CommandInteraction) {
  const userId = interaction.telegramUser?.id;
  if (!userId) return "No telegram user found in interaction";
  clearChatOngoingCommandsForUser({
    userId,
    chatId: interaction.chat.id,
  });
  return `Successfully cancelled the command.`;
}
