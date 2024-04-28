import { Command, CommandInteraction } from "../types/commands";
import addOngoingCommand from "../utils/addOngoingCommand";
import { OngoingCommand } from "../db/entity/OngoingCommands";
import clearChatOngoingCommandsForUser from "../utils/clearChatOngoingCommandsForUser";
import getOrCreateUser from "../utils/getOrCreateUser";
import { User } from "../db/entity/User";
import renderProfile from "../utils/renderProfile";
import { MatchRepository, OngoingCommandRepository } from "../db";
import notifyUser from "../utils/notifyUser";
import getMatchingMentor from "../utils/getMatchingMentor";
import TelegramBot, { Message } from "node-telegram-bot-api";
import getOngoingCommand from "../utils/getOngoingCommand";

export const commandSettings: Command = {
  name: "find_mentor",
  regex: /\/find_mentor/,
  description: "Find a mentor",
  handler,
  help: "Use this command to find a mentor that matches your interests and needs",
  onButton,
};

async function handler(interaction: CommandInteraction) {
  const userId = interaction.telegramUser?.id;
  if (!userId) return "No telegram user found in interaction";
  clearChatOngoingCommandsForUser({ userId, chatId: interaction.chat.id });
  // Add user to db if not exists
  const ongoingCommand = await addOngoingCommand({
    command: "find_mentor",
    userId,
    chatId: interaction.chat.id,
  });
  const telegramUser = interaction.telegramUser;
  if (!telegramUser) return "No telegram user found in interaction";
  const user = await getOrCreateUser(telegramUser.id);
  if (!user) return "User not found";
  return update(user, ongoingCommand);
}

async function onButton(value: string, message: Message, bot: TelegramBot) {
  const telegramUserId = message.chat.id;
  const chatId = message.chat.id;
  const ongoingCommand = await getOngoingCommand({
    userId: telegramUserId,
    chatId,
  });
  if (!ongoingCommand) return "No ongoing command found";
  const user = await getOrCreateUser(ongoingCommand.userId);
  if (!user) return "User not found";
  const data = ongoingCommand.data as {
    mentorId: number;
    mentorTelegramId: number;
  };
  if (value === "next" || value === "match") {
    if (data?.mentorId)
      await MatchRepository.save({
        userId: user.id,
        mentorId: data?.mentorId,
        matching: value === "match",
      });
  }
  if (value === "match") {
    if (data?.mentorTelegramId)
      await notifyUser({
        telegramUserId: data?.mentorTelegramId,
        message:
          "You have been matched with a mentee. Please contact them. Use /check_matches to see your matches.",
        bot: bot,
      });
  }
  const actionMessage =
    value === "next"
      ? "🔁 Nexted\n\n"
      : value === "/match"
      ? "🔥 Matched\n\n"
      : "";
  return update(user, ongoingCommand, actionMessage);
}

async function update(
  user: User,
  ongoingCommand: OngoingCommand,
  actionMessage = ""
) {
  const mentor = await getMatchingMentor(user);
  if (!mentor) {
    if (ongoingCommand.stepId === 0)
      return "No mentor currently available. Please try again later or contact support.";
    return (
      actionMessage +
      "You have reached the end of the list. Use /reset_search to start over if you think you missed a mentor."
    );
  }
  ongoingCommand.stepId++;
  // Update ongoing command data
  ongoingCommand.data = {
    mentorId: mentor.id,
    mentorTelegramId: mentor.telegramId,
  };
  await OngoingCommandRepository.save(ongoingCommand);

  return {
    response: `${actionMessage ? `${actionMessage}\n\n` : ""}${renderProfile({
      user: mentor,
    })}`,
    options: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: "🔥 Match", callback_data: "find_mentor:match" },
            { text: "🔁 Next", callback_data: "find_mentor:next" },
          ],
        ],
      }),
    },
  };
}
