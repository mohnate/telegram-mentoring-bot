import { Command, CommandInteraction } from "../types/commands";
import { MatchRespository } from "../db";

export const commandSettings: Command = {
  name: "reset_search",
  regex: /\/reset_search/,
  description: "Reset the search",
  handler,
};

async function handler(interaction: CommandInteraction) {
  const userId = interaction.telegramUser?.id;
  if (!userId) return "No telegram user found in interaction";
  await MatchRespository.delete({
    userId,
    matching: false,
  });

  return "Search reset. You can start over the matching process by using /find_mentor.";
}
