import { OngoingCommandRepository } from "../db";
import { OngoingCommand } from "../db/entity/OngoingCommands";
import { AsyncUtilsFunction } from "../types/utils";

const getOngoingCommand: AsyncUtilsFunction<
  { userId: number; chatId: number },
  OngoingCommand | null
> = async ({ userId, chatId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const ongoingCommand = OngoingCommandRepository.findOne({
    where: { userId, chatId },
  });
  return ongoingCommand;
};

export default getOngoingCommand;
