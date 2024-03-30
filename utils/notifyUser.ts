import TelegramBot from "node-telegram-bot-api";
import { AsyncUtilsFunction } from "../types/utils";

type NotifyUserOptions = {
  telegramUserId: number;
  message: string;
  bot: TelegramBot;
};

const notifyUser: AsyncUtilsFunction<NotifyUserOptions, void> = async ({
  telegramUserId,
  message,
  bot,
}) => {
  try {
    // Send message to user
    await bot.sendMessage(telegramUserId, message);
  } catch (error) {}
};

export default notifyUser;
