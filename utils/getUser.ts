import { UserRepository } from "../db";
import { User } from "../db/entity/User";
import { AsyncUtilsFunction } from "types/utils";

const getUser: AsyncUtilsFunction<number, User | null> = async (telegramId) => {
  if (!telegramId) {
    throw new Error("User ID is required");
  }
  const user = await UserRepository.findOne({
    where: { telegramId },
  });
  return user;
};

export default getUser;
