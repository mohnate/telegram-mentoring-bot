import { Command, CommandInteraction } from "../types/commands";

export const commandSettings: Command = {
  name: "start",
  regex: /\/start/,
  description: "Help",
  handler,
  help: "Get started with the bot!",
};

async function handler(interaction: CommandInteraction) {
  return `Welcome to the Mentorship bot! Here are some commands you can use:
- /setup_profile: Create your profile
- /view_profile: View your profile
- /edit_profile: Edit your profile
`;
}
