import { WhitelistedMenorRepository } from "db";

const assertWhitelistedMentor = (username: string) => {
  const whitelistedMentor = WhitelistedMenorRepository.findOne({
    where: { username },
  });
  if (!whitelistedMentor) {
    throw new Error(
      "You are not a whitelisted mentor. Please ask an admin to add you to the whitelist."
    );
  }
};

export default assertWhitelistedMentor;
