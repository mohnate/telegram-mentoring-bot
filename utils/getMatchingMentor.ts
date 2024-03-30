import { MatchRespository, UserRepository } from "../db";
import { User } from "../db/entity/User";
import { AsyncUtilsFunction } from "../types/utils";
import profile from "../config/profile.json";
import getUserAvailableFields from "./getUserAvailableFields";

const getMatchingMentor: AsyncUtilsFunction<
  User | undefined,
  User | null
> = async (user) => {
  if (!user) return null;
  const users = await UserRepository.find({
    where: { isMentor: true },
  });
  const userMatches = await MatchRespository.find({
    where: { userId: user.id },
  });
  const userProfile = user.profile;
  if (!userProfile) return null;

  const notMatchedUsers = users.filter(
    (mentor) =>
      !userMatches.find((match) => match.mentorId === mentor.id) &&
      mentor.id !== user.id
  );

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
      if (criteria.type === "topics" || criteria.type === "stringArray") {
        // Check with which mentor the user has most matching topics
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
