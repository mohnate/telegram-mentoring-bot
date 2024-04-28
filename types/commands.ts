import { OngoingCommand } from "db/entity/OngoingCommands";
import TelegramBot, { Chat, Message, User } from "node-telegram-bot-api";

export type CommandRes =
  | {
      response: string;
      options: {
        reply_markup: string;
      };
    }
  | string;

export type Command = {
  name: string;
  regex: RegExp;
  description: string;
  handler: (interaction: CommandInteraction) => Promise<CommandRes>;
  onProgress?: (
    interaction: CommandInteraction,
    ongoingCommand: OngoingCommand
  ) => Promise<CommandRes>;
  help?: string;
  onButton?: (
    value: string,
    message: Message,
    bot: TelegramBot
  ) => Promise<CommandRes>;
};

export type CommandInteraction = {
  content: string;
  telegramUser?: User;
  chat: Chat;
  bot: TelegramBot;
};

export type InteractionType = "APPLICATION_COMMAND";
