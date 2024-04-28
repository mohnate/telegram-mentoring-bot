import { MatchRepository, UserRepository } from "../db";
import { Not } from "typeorm";
import { AsyncUtilsFunction } from "types/utils";
import getMentorMenteeLimit from "./getMentorMenteeLimit";

const doesMentorAcceptMentees: AsyncUtilsFunction<number, boolean> = async (
  mentorId
) => {
  // Get number of mentees
  // Filter by mentorId, matching: true, accepted: true or NULL
  const count = await MatchRepository.count({
    where: { mentorId, matching: true, accepted: Not(false) },
  });
  // Get mentor
  const user = await UserRepository.findOne({ where: { id: mentorId } });
  if (!user) return false;
  const limit = getMentorMenteeLimit(user);
  if (!limit) return true;
  // Check if number of mentees is less than limit
  return count < limit;
};

export default doesMentorAcceptMentees;
