import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { WhitelistedMentor } from "./entity/WhitelistedMentors";
import { Link } from "./entity/Links";
import config from "../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
  synchronize: false,
  logging: false,
  entities: [User, WhitelistedMentor, Link],
  migrations: [__dirname + "/migration/**/*.{js,ts}"],
  migrationsTableName: "migrations",
  subscribers: [],
});
