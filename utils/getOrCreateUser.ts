import { UserRepository } from "../db";
import { User } from "../db/entity/User";
import { AsyncUtilsFunction } from "types/utils";
import getUser from "./getUser";

const getOrCreateUser: AsyncUtilsFunction<number, User | null> = async (
  telegramId
) => {
  const user = await getUser(telegramId);
  if (user) return user;
  // Create user if not exists
  const newUser = new User();
  newUser.telegramId = telegramId;
  newUser.profile = {};
  newUser.isMentor = false;
  await UserRepository.save(newUser);
  return newUser;
};

export default getOrCreateUser;
