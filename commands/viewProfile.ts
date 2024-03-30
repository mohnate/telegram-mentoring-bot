import { Command, CommandInteraction } from "../types/commands";
import getUser from "../utils/getUser";
import renderProfile from "../utils/renderProfile";

export const commandSettings: Command = {
  name: "view_profile",
  regex: /\/view_profile/,
  description: "View your profile",
  handler,
  help: "View your profile",
};

async function handler({ telegramUser }: CommandInteraction) {
  if (!telegramUser) return "No telegram user found in interaction";
  const user = await getUser(telegramUser.id);
  return renderProfile({ user, renderPrivate: true });
}
