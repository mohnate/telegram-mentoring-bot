import { OngoingCommandRepository } from "../db";
import { AsyncUtilsFunction } from "../types/utils";

type IncrementOngoingCommandOptions = {
  ongoingCommandId: number;
  chatId: number;
};

const incrementOngoingCommand: AsyncUtilsFunction<
  IncrementOngoingCommandOptions,
  void
> = async ({ ongoingCommandId, chatId }) => {
  const ongoingCommand = await OngoingCommandRepository.findOne({
    where: { id: ongoingCommandId, chatId },
  });
  if (!ongoingCommand) {
    throw new Error("Ongoing command not found");
  }
  ongoingCommand.stepId += 1;
  await OngoingCommandRepository.save(ongoingCommand);
};

export default incrementOngoingCommand;
