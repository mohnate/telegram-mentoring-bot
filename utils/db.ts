import { AsyncUtilsFunction } from "types/utils";
import { createConnection, Connection } from "mysql2/promise";
import { State } from "types/state";
import newState from "./newState";

type GetDbOptions = {
  state: State;
} | void;

type GetDbResult = {
  connection: Connection;
  state: State;
};

export const getDb: AsyncUtilsFunction<GetDbOptions, GetDbResult> = async (
  options
) => {
  if (options?.state?.db?.connection)
    return { connection: options.state.db.connection, state: options.state };
  const connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const state = options?.state || newState();
  state.db.connection = connection;
  state.db.wasConnectionGenerated = true;

  return { connection, state };
};

export const endAction: AsyncUtilsFunction<State, void> = async (state) => {
  if (state.db.wasConnectionGenerated && state.db.connection)
    await state.db.connection.end();
};
