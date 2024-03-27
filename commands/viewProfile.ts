import { Command, CommandInteraction } from "../types/commands";
import getUser from "../utils/getUser";
import getField from "../utils/getField";
import renderFieldValue from "../utils/renderFieldValue";

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
  if (!user) return "No profile yet! Create one with /setup_profile.";
  const profile = user.profile;
  const profileString = Object.keys(profile)
    .map(
      (key) =>
        `${getField(key)?.label}: ${renderFieldValue({
          field: getField(key),
          fieldValue: profile[key],
        })}`
    )
    .join("\n");
  return profileString;
}
