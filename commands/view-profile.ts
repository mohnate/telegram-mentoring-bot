import { Command, CommandInteraction } from "types/commands";
import { getDb } from "utils/db";
import getUser from "utils/getUser";

const viewProfileCommand: Command = {
  name: "view-profile",
  description: "View your profile",
  options: [],
  execute,
  help: "View your profile",
};

async function execute(interaction: CommandInteraction) {
  const user = await getUser({ id: interaction.id });
  if (!user) throw new Error("No profile yet! Create one with /setup-profile.");
  const { connection } = await getDb();
  console.log(connection);
}

export default viewProfileCommand;
