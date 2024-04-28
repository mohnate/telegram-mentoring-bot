import { MatchRepository, UserRepository } from "../db";
import { User } from "../db/entity/User";
import { AsyncUtilsFunction } from "../types/utils";
import profile from "../config/profile.json";
import getUserAvailableFields from "./getUserAvailableFields";
import getMentorMenteeLimit from "./getMentorMenteeLimit";
import { Matches } from "../db/entity/Matches";

const getMatchingMentor: AsyncUtilsFunction<
  User | undefined,
  User | null
> = async (user) => {
  if (!user) return null;
  const users = await UserRepository.find({
    where: { isMentor: true },
  });
  const matches = await MatchRepository.find();
  const userMatches = matches.filter((match) => match.userId === user.id);
  const userProfile = user.profile;
  if (!userProfile) return null;

  const notMatchedUsers = users.filter((mentor) => {
    const isAlreadyMatched =
      userMatches.find((match) => match.mentorId === mentor.id) ||
      mentor.id === user.id;
    const mentoringLimit = getMentorMenteeLimit(mentor);
    // Get number of mentees, if limit is reached, skip this mentor
    const menteeCount = getMenteeCount(mentor.id, matches);
    return !isAlreadyMatched && menteeCount < mentoringLimit;
  });

  notMatchedUsers.sort((a: User, b: User) => {
    const criterias = profile.mentorFields.filter(
      (field) => field.matchingField
    );
    for (let index = 0; index < criterias.length; index++) {
      const criteria = criterias[index];
      const userField = getUserAvailableFields(false).find(
        (field) => field.name === criteria.matchingField
      );
      if (!userField) continue;
      const userValue = userProfile[userField.id];
      if (!userValue) continue;
      const aField = getUserAvailableFields(true).find(
        (field) => field.name === criteria.name
      );
      const bField = getUserAvailableFields(true).find(
        (field) => field.name === criteria.name
      );
      if (!aField || !bField) continue;
      const aValue = a.profile[aField.id];
      const bValue = b.profile[bField.id];
      if (criteria.type === "stringArray") {
        // Check with which mentor the user has most matching topics
        const aMenteeCount = getMenteeCount(a.id, matches);
        const bMenteeCount = getMenteeCount(b.id, matches);
        // Sort by mentee count
        if (aMenteeCount < bMenteeCount) return -1;
        if (aMenteeCount > bMenteeCount) return 1;
        const userTopics = userValue as string[];
        const aTopics = aValue as string[];
        const bTopics = bValue as string[];
        const aMatchingTopics = userTopics.filter((topic) =>
          aTopics.includes(topic)
        ).length;
        const bMatchingTopics = userTopics.filter((topic) =>
          bTopics.includes(topic)
        ).length;
        if (aMatchingTopics > bMatchingTopics) return -1;
        if (aMatchingTopics < bMatchingTopics) return 1;
      }
    }
    return -1;
  });

  return notMatchedUsers[0] || null;
};

export default getMatchingMentor;

const getMenteeCount = (mentorId: number, matches: Matches[]) => {
  return matches.filter(
    (match) => match.mentorId === mentorId && match.matching && match.accepted
  ).length;
};
