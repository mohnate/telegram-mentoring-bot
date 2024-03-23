import { Message } from "node-telegram-bot-api";
import { CommandInteraction } from "types/commands";
import { UtilsFunction } from "types/utils";

const parseInteraction: UtilsFunction<Message, CommandInteraction> = (
  message
) => {
  const parts = message.text?.split(" ") || [];
  const content = parts.slice(1, parts.length).join(" ") || "";
  const telegramUser = message.from;
  const chat = message.chat;
  return { content, telegramUser, chat };
};

export default parseInteraction;
