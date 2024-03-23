import { Command, CommandInteraction } from "../types/commands";

export const commandSettings: Command = {
  name: "edit_profile",
  regex: /\/edit_profile/,
  description: "Edit your profile",
  handler,
  help: "Edit your profile",
};

async function handler(interaction: CommandInteraction) {
  console.log("Edit profile handler", interaction);
}
