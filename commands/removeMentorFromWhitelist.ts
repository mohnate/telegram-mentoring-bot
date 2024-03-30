import isAdmin from "../utils/isAdmin";
import { WhitelistedMentorRepository } from "../db";
import { Command, CommandInteraction } from "../types/commands";

export const commandSettings: Command = {
  name: "remove_mentor_from_whitelist",
  regex: /\/remove_mentor_from_whitelist/,
  description: "Remove a mentor from whitelist",
  handler,
};

async function handler(interaction: CommandInteraction) {
  if (!isAdmin(interaction.telegramUser?.username))
    return "You are not allowed to run this command";
  const res = await WhitelistedMentorRepository.delete({
    username: interaction.content,
  });
  if (res.affected)
    return `Mentor ${interaction.content} has been removed from whitelist`;
  return `Mentor ${interaction.content} is not whitelisted`;
}
