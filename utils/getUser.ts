import { User } from "types/documents";
import { AsyncUtilsFunction } from "types/utils";

type GetUserOptions = {
  id: string | number;
  state?: Record<string, unknown>;
};

const getUser: AsyncUtilsFunction<GetUserOptions, User> = async ({
  id,
  state = {},
}) => {
  return {};
};

export default getUser;
