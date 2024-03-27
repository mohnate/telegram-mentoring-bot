import { OngoingCommandRepository } from "../db";
import { AsyncUtilsFunction } from "../types/utils";

const clearChatOngoingCommandsForUser: AsyncUtilsFunction<
  {
    userId: number;
    chatId: number;
  },
  void
> = async ({ userId, chatId }) => {
  OngoingCommandRepository.delete({
    userId,
    chatId,
  });
};

export default clearChatOngoingCommandsForUser;
