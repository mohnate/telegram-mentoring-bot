import { Connection } from "mysql2/promise";

export type State = {
  db: {
    connection: Connection | null;
    wasConnectionGenerated: boolean;
  };
};
