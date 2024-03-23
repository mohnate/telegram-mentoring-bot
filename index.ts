import assertValidConfig from "assertions/assertValidConfig";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
dotenv.config({ path: ".env.local" });

const { botToken } = assertValidConfig();

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {});
