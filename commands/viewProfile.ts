import { Command, CommandInteraction } from "../types/commands";
import getUser from "../utils/getUser";

export const commandSettings: Command = {
  name: "view_profile",
  regex: /\/view_profile/,
  description: "View your profile",
  handler,
  help: "View your profile",
};

async function handler({ telegramUser }: CommandInteraction) {
  if (!telegramUser) throw new Error("No telegram user found in interaction");
  const user = await getUser(telegramUser.id);
  if (!user) throw new Error("No profile yet! Create one with /setup-profile.");
  const profile = user.profile;
  const profileString = Object.keys(profile)
    .map((key) => `${key}: ${profile[key]}`)
    .join("\n");
  return `Your profile:\n${profileString}`;
}
