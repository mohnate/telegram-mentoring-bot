import isAdmin from "../utils/isAdmin";
import { Command, CommandInteraction } from "../types/commands";
import { WhitelistedMentorRepository } from "../db";

export const commandSettings: Command = {
  name: "whitelist_mentor",
  regex: /\/whitelist_mentor/,
  description: "Whitelist a mentor to be able to create a mentor profile.",
  handler,
  help: "Probide the username of the mentor you want to whitelist.",
};

async function handler(interaction: CommandInteraction) {
  if (!isAdmin(interaction.telegramUser?.username))
    return "You are not allowed to run this command";
  WhitelistedMentorRepository.save({
    username: interaction.content,
  });
  return `Mentor ${interaction.content} has been whitelisted`;
}
