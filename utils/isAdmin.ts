import { UtilsFunction } from "types/utils";
import administrators from "../config/administrators.json";

const isAdmin: UtilsFunction<string, boolean> = (username: string) =>
  administrators.includes(username);

export default isAdmin;
