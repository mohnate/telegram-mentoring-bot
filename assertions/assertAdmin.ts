import administrators from "../config/administrators.json";

const assertAdmin = (username: string) => {
  if (!administrators.includes(username)) {
    throw new Error("This action requires admin privileges.");
  }
};

export default assertAdmin;
