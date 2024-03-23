import { Command, CommandInteraction } from "../types/commands";

export const commandSettings: Command = {
  name: "setup_profile",
  regex: /\/setup_profile/,
  description: "Setup your profile",
  handler,
  help: "Edit your profile",
};

async function handler(interaction: CommandInteraction) {
  console.log("Edit profile handler", interaction);
}
