import { User } from "db/entity/User";
import { UtilsFunction } from "types/utils";

const getMentorMenteeLimit: UtilsFunction<User, number> = (mentor) => {
  const limit = mentor?.profile["13"] as number | undefined;
  if (!limit) return 0;
  return limit;
};

export default getMentorMenteeLimit;
