import { WhitelistedMentorRepository } from "../db";
import { AsyncUtilsFunction } from "../types/utils";

const isWhitelistedMentor: AsyncUtilsFunction<
  string | undefined,
  boolean
> = async (username) => {
  if (!username) return false;
  const whitelistedMentor = await WhitelistedMentorRepository.findOne({
    where: { username },
  });
  return Boolean(whitelistedMentor);
};

export default isWhitelistedMentor;
