import { User } from "db/entity/User";
import { UtilsFunction } from "types/utils";
import renderFieldValue from "./renderFieldValue";
import getField from "./getField";

type RenderProfileOptions = {
  user: User | null;
  renderPrivate?: boolean;
};

const renderProfile: UtilsFunction<RenderProfileOptions, string> = ({
  user,
  renderPrivate = false,
}) => {
  if (!user) return "No profile yet! Create one with /setup_profile.";
  const profile = user.profile;
  const profileString = Object.keys(profile)
    .filter((key) => renderPrivate || !getField(key)?.private)
    .map(
      (key) =>
        `${getField(key)?.label}: ${renderFieldValue({
          field: getField(key),
          fieldValue: profile[key],
        })}`
    )
    .join("\n");
  return profileString;
};

export default renderProfile;
