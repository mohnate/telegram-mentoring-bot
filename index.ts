import assertValidConfig from "./assertions/assertValidConfig";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import parseInteraction from "./utils/parseInteraction";
import { setupDb } from "./db";
import config from "./config";
import getOngoingCommand from "./utils/getOngoingCommand";

const startBot = async () => {
  assertValidConfig();

  const bot = new TelegramBot(config.BOT_TOKEN as string, {
    polling: true,
  });

  // Load commands
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "./commands"))
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
  const commands = commandFiles.map((file) =>
    require(path.join(__dirname, `./commands/${file}`))
  );

  // Register commands
  commands.forEach((commandFile) => {
    const command = commandFile.commandSettings;
    console.log("Registering command", command.name);
    bot.onText(command.regex, async (message) => {
      const res = await command.handler(parseInteraction({ message }));
      if (res) bot.sendMessage(message.chat.id, res);
    });
  });

  // Handle ongoing commands
  bot.on("message", async (message) => {
    const from = message.from;
    if (!from) return;
    const ongoingCommand = await getOngoingCommand({
      userId: from.id,
      chatId: message.chat.id,
    });
    // Check if a command
    const isCommand = commands.some((command) =>
      command.commandSettings.regex.test(message.text || "")
    );
    if (isCommand) return;
    if (ongoingCommand) {
      const command = commands.find(
        (command) => command.commandSettings.name === ongoingCommand.command
      );
      if (command && command.commandSettings.onProgress) {
        const res = await command.commandSettings.onProgress(
          parseInteraction({
            message,
            isStep: true,
          }),
          ongoingCommand
        );
        if (res) bot.sendMessage(message.chat.id, res);
      }
    }
  });

  console.log("Connecting to database...");
  await setupDb();

  console.log("Mantor Bot successfully started!");
};

startBot();
