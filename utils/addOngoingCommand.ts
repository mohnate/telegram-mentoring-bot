import { OngoingCommandRepository } from "../db";
import { AsyncUtilsFunction } from "../types/utils";

const addOngoingCommand: AsyncUtilsFunction<
  {
    command: string;
    userId: number;
    chatId: number;
  },
  void
> = async ({ command, userId, chatId }) => {
  await OngoingCommandRepository.save({
    command,
    userId,
    chatId,
    stepId: 0,
  });
};

export default addOngoingCommand;
