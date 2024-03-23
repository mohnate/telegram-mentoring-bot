import assertValidConfig from "./assertions/assertValidConfig";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import parseInteraction from "./utils/parseInteraction";
dotenv.config({ path: ".env.local" });

assertValidConfig();

const bot = new TelegramBot(process.env.BOT_TOKEN as string, { polling: true });

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
  bot.onText(command.regex, (message) => {
    command.handler(parseInteraction(message)).catch(console.error);
  });
});

console.log("Mantor Bot successfully started!");
