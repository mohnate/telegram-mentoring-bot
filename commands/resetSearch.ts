import { Command, CommandInteraction } from "../types/commands";
import { MatchRespository, UserRepository } from "../db";

export const commandSettings: Command = {
  name: "reset_search",
  regex: /\/reset_search/,
  description: "Reset the search",
  handler,
};

async function handler(interaction: CommandInteraction) {
  const telegramUserId = interaction.telegramUser?.id;
  if (!telegramUserId) return "No telegram user found in interaction";
  const user = await UserRepository.findOne({
    where: { telegramId: telegramUserId },
  });
  if (!user) return "User not found";
  const userId = user.id;
  await MatchRespository.delete({
    userId,
    matching: false,
  });

  return "Search reset. You can start over the matching process by using /find_mentor.";
}
