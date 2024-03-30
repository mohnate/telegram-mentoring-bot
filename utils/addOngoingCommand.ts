import { OngoingCommand } from "db/entity/OngoingCommands";
import { OngoingCommandRepository } from "../db";
import { AsyncUtilsFunction } from "../types/utils";

const addOngoingCommand: AsyncUtilsFunction<
  {
    command: string;
    userId: number;
    chatId: number;
  },
  OngoingCommand
> = async ({ command, userId, chatId }) => {
  const ongoingCommand = await OngoingCommandRepository.save({
    command,
    userId,
    chatId,
    stepId: 0,
  });

  return ongoingCommand;
};

export default addOngoingCommand;
