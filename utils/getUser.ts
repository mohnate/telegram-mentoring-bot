import { UserRepository } from "../db";
import { User } from "../db/entity/User";
import { AsyncUtilsFunction } from "types/utils";

const getUser: AsyncUtilsFunction<number, User | null> = async (id) => {
  if (!id) {
    throw new Error("User ID is required");
  }
  const user = UserRepository.findOne({
    where: { id },
  });
  return user;
};

export default getUser;
