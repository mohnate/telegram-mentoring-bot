import { Message } from "node-telegram-bot-api";
import { CommandInteraction } from "types/commands";
import { UtilsFunction } from "types/utils";

const parseInteraction: UtilsFunction<
  { message: Message; isStep?: boolean },
  CommandInteraction
> = ({ message, isStep = false }) => {
  const telegramUser = message.from;
  const chat = message.chat;
  if (isStep) return { content: message.text || "", telegramUser, chat };
  const parts = message.text?.split(" ") || [];
  const content = parts.slice(1, parts.length).join(" ") || "";
  return { content, telegramUser, chat };
};

export default parseInteraction;
