import config from "../config";

const assertValidConfig = () => {
  if (!config.BOT_TOKEN) throw new Error("BOT_TOKEN is not set in .env.local");
};

export default assertValidConfig;
