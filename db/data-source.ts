import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { WhitelistedMentor } from "./entity/WhitelistedMentors";
import { Link } from "./entity/Links";
import config from "../config";
import { OngoingCommand } from "./entity/OngoingCommands";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
  synchronize: false,
  logging: false,
  entities: [User, WhitelistedMentor, Link, OngoingCommand],
  migrations: [__dirname + "/migration/**/*.{js,ts}"],
  migrationsTableName: "migrations",
  subscribers: [],
});
