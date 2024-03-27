import { WhitelistedMenorRepository } from "db";
import { AsyncUtilsFunction } from "types/utils";

const isWhitelistedMentor: AsyncUtilsFunction<string, boolean> = async (
  username: string
) => {
  const whitelistedMentor = await WhitelistedMenorRepository.findOne({
    where: { username },
  });
  return Boolean(whitelistedMentor);
};

export default isWhitelistedMentor;
