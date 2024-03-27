import { OngoingCommand } from "db/entity/OngoingCommands";
import { Chat, User } from "node-telegram-bot-api";

export type Command = {
  name: string;
  regex: RegExp;
  description: string;
  handler: (interaction: CommandInteraction) => Promise<string>;
  onProgress?: (
    interaction: CommandInteraction,
    ongoingCommand: OngoingCommand
  ) => Promise<string>;
  help?: string;
};

export type CommandInteraction = {
  content: string;
  telegramUser?: User;
  chat: Chat;
};

export type InteractionType = "APPLICATION_COMMAND";
