const assertValidConfig = () => {
  const chechVars = [
    "BOT_TOKEN",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "DB_HOST",
  ];
  chechVars.forEach((varName) => {
    if (!process.env[varName])
      throw new Error(`${varName} env var is not defined`);
  });
};

export default assertValidConfig;
