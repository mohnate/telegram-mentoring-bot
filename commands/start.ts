import getUser from "../utils/getUser";
import { Command, CommandInteraction } from "../types/commands";

export const commandSettings: Command = {
  name: "start",
  regex: /\/(start|help)/,
  description: "Help",
  handler,
  help: "Get started with the bot!",
};

async function handler(interaction: CommandInteraction) {
  const telegramUserId = interaction.telegramUser?.id;
  if (!telegramUserId) return "No telegram user found in interaction";
  const user = await getUser(telegramUserId);
  let common = `- /setup_profile: Create your profile
- /view_profile: View your profile`;

  if (user?.isMentor) {
    common += `
- /check_matches: Check matches (you will be notified when you have a match)`;
  }
  if (user && !user?.isMentor) {
    common += `
- /find_mentor: Find a mentor;
- /reset_search: Use this command if you think you nexted too many mentors and want to start over.`;
  }

  return `Welcome to the Mentorship bot! Here are some commands you can use:
${common}`;
}
