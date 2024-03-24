import { Command, CommandInteraction } from "../types/commands";

export const commandSettings: Command = {
  name: "remove_mentor_from_whitelist",
  regex: /\/remove_mentor_from_whitelist/,
  description: "Remove a mentor from whitelist",
  handler,
};

async function handler(interaction: CommandInteraction) {
  return "Edit profile handler";
}
