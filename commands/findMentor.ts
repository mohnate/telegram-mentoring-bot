import { Command, CommandInteraction } from "../types/commands";
import addOngoingCommand from "../utils/addOngoingCommand";
import { OngoingCommand } from "../db/entity/OngoingCommands";
import clearChatOngoingCommandsForUser from "../utils/clearChatOngoingCommandsForUser";
import getOrCreateUser from "../utils/getOrCreateUser";
import { User } from "../db/entity/User";
import renderProfile from "../utils/renderProfile";
import { MatchRespository, OngoingCommandRepository } from "../db";
import notifyUser from "../utils/notifyUser";
import getMatchingMentor from "../utils/getMatchingMentor";

export const commandSettings: Command = {
  name: "find_mentor",
  regex: /\/find_mentor/,
  description: "Find a mentor",
  handler,
  help: "Use this command to find a mentor that matches your interests and needs",
  onProgress,
};

async function handler(interaction: CommandInteraction) {
  const userId = interaction.telegramUser?.id;
  if (!userId) return "No telegram user found in interaction";
  clearChatOngoingCommandsForUser({ userId, chatId: interaction.chat.id });
  // Add user to db if not exists
  const ongoingCommand = await addOngoingCommand({
    command: "find_mentor",
    userId,
    chatId: interaction.chat.id,
  });
  const telegramUser = interaction.telegramUser;
  if (!telegramUser) return "No telegram user found in interaction";
  const user = await getOrCreateUser(telegramUser.id);
  if (!user) return "User not found";
  return update(user, ongoingCommand);
}

async function onProgress(
  interaction: CommandInteraction,
  ongoingCommand: OngoingCommand
) {
  const user = await getOrCreateUser(ongoingCommand.userId);
  if (!user) return "User not found";
  const data = ongoingCommand.data as {
    mentorId: number;
    mentorTelegramId: number;
  };
  if (interaction.content === "/next" || interaction.content === "/match") {
    await MatchRespository.save({
      userId: user.id,
      mentorId: data?.mentorId,
      matching: interaction.content === "/match",
    });
  }
  if (interaction.content === "/match") {
    await notifyUser({
      telegramUserId: data.mentorTelegramId,
      message:
        "You have been matched with a mentee. Please contact them. Use /check_matches to see your matches.",
      bot: interaction.bot,
    });
  }
  return update(user, ongoingCommand);
}

async function update(user: User, ongoingCommand: OngoingCommand) {
  const mentor = await getMatchingMentor(user);
  if (!mentor)
    return "No mentor found. You can start over the matching process by using /reset_search, which will remove any next you did.";
  // Update ongoing command data
  ongoingCommand.data = {
    mentorId: mentor.id,
    mentorTelegramId: mentor.telegramId,
  };
  await OngoingCommandRepository.save(ongoingCommand);

  return `${renderProfile({ user: mentor })}\n\n /match OR /next`;
}
