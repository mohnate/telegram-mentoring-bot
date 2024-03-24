import assertValidConfig from "./assertions/assertValidConfig";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import parseInteraction from "./utils/parseInteraction";
import { setupDb } from "./db";
import config from "./config";

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
      try {
        const res = await command
          .handler(parseInteraction(message))
          .catch(console.error);
        if (res) {
          bot.sendMessage(message.chat.id, res);
        }
      } catch (e) {
        bot.sendMessage(message.chat.id, JSON.stringify(e));
      }
    });
  });

  console.log("Connecting to database...");
  await setupDb();

  console.log("Mantor Bot successfully started!");
};

startBot();
