const assertValidConfig = () => {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) throw new Error("BOT_TOKEN env var is not defined");
  return { botToken };
};

export default assertValidConfig;
