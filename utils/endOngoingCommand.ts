import { OngoingCommandRepository } from "../db";
import { AsyncUtilsFunction } from "../types/utils";

const endOngoingCommand: AsyncUtilsFunction<number, void> = async (
  ongoingCommandId
) => {
  await OngoingCommandRepository.delete({
    id: ongoingCommandId,
  });
};

export default endOngoingCommand;
