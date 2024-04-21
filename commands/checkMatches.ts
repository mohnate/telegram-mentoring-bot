import { Command, CommandInteraction } from "../types/commands";
import addOngoingCommand from "../utils/addOngoingCommand";
import { OngoingCommand } from "../db/entity/OngoingCommands";
import clearChatOngoingCommandsForUser from "../utils/clearChatOngoingCommandsForUser";
import getOrCreateUser from "../utils/getOrCreateUser";
import { User } from "../db/entity/User";
import renderProfile from "../utils/renderProfile";
import {
  MatchRespository,
  OngoingCommandRepository,
  UserRepository,
} from "../db";
import notifyUser from "../utils/notifyUser";
import { IsNull, Not, Or } from "typeorm";

export const commandSettings: Command = {
  name: "check_matches",
  regex: /\/check_matches/,
  description: "Check matches",
  handler,
  help: "Use this command to find check if you have pending matches. If you have a pending match, you can choose to match with them or skip to the next one.",
  onProgress,
};

async function handler(interaction: CommandInteraction) {
  const userId = interaction.telegramUser?.id;
  if (!userId) return "No telegram user found in interaction";
  clearChatOngoingCommandsForUser({ userId, chatId: interaction.chat.id });
  // Add user to db if not exists
  const ongoingCommand = await addOngoingCommand({
    command: "check_matches",
    userId,
    chatId: interaction.chat.id,
  });
  const telegramUser = interaction.telegramUser;
  if (!telegramUser) return "No telegram user found in interaction";
  const user = await getOrCreateUser(telegramUser.id);
  if (!user) return "User not found";
  return update(user, ongoingCommand);
}

async function onProgress(
  interaction: CommandInteraction,
  ongoingCommand: OngoingCommand
) {
  const user = await getOrCreateUser(ongoingCommand.userId);
  if (!user) return "User not found";
  const data = ongoingCommand.data as {
    userId: number;
    telegramUserId: number;
  };
  if (!data) return await end(ongoingCommand);
  const match = await MatchRespository.findOne({
    where: {
      userId: data.userId,
      mentorId: user.id,
      matching: true,
      accepted: Or(Not(true), IsNull()),
    },
  });
  if (!match) return "Match not found";
  if (interaction.content === "/decline_match") {
    match.matching = false;
    await MatchRespository.save(match);
  }
  if (interaction.content === "/accept_match") {
    notifyUser({
      telegramUserId: data.telegramUserId,
      message: `You have been matched with a mentor. please contact him.\n${renderProfile(
        { user, renderPrivate: true }
      )}`,
      bot: interaction.bot,
    });
    match.accepted = true;
    await MatchRespository.save(match);
    OngoingCommandRepository.delete({ id: ongoingCommand.id });
    return `You can directly message the user by using the information on his profile. He should also receive a notification.`;
  }

  return await update(user, ongoingCommand);
}

async function update(user: User, ongoingCommand: OngoingCommand) {
  const matches = await MatchRespository.find({
    where: {
      mentorId: user.id,
      matching: true,
      accepted: Or(Not(true), IsNull()),
    },
  });
  if (matches.length === 0) return await end(ongoingCommand);
  const firstMatch = matches[0];
  const matchedUser = await UserRepository.findOne({
    where: { id: firstMatch.userId },
  });
  if (!matchedUser) return "Deleted user found in matches. Please try again.";
  // Update ongoing command data
  ongoingCommand.data = {
    userId: matchedUser.id,
    telegramUserId: matchedUser.telegramId,
  };
  await OngoingCommandRepository.save(ongoingCommand);

  return `${renderProfile({
    user: matchedUser,
  })}\n\n /accept_match OR /decline_match`;
}

async function end(ongoingCommand: OngoingCommand) {
  await OngoingCommandRepository.delete({ id: ongoingCommand.id });
  return "No pending matches found. Please try again later. If you received a notification, it might mean that the user has already been matched with someone else.";
}
