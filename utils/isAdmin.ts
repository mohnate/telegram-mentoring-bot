import { UtilsFunction } from "types/utils";
import administrators from "../config/administrators.json";

const isAdmin: UtilsFunction<string | undefined, boolean> = (username) =>
  administrators.includes(username || "");

export default isAdmin;
