import { Command, CommandInteraction } from "../types/commands";

export const commandSettings: Command = {
  name: "whitelist_mentor",
  regex: /\/whitelist_mentor/,
  description: "Whitelist a mentor to be able to create a mentor profile.",
  handler,
  help: "Probide the username of the mentor you want to whitelist.",
};

async function handler(interaction: CommandInteraction) {
  return `Whitelist mentor handler`;
}
