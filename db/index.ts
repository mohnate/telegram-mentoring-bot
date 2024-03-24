import { AppDataSource } from "./data-source";
import { Link } from "./entity/Links";
import { User } from "./entity/User";
import { WhitelistedMentor } from "./entity/WhitelistedMentors";
import { setupMigrations } from "./setup-migrations";

export const setupDb = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    await setupMigrations();
    await AppDataSource.runMigrations({ transaction: "each" });
  }
};

export const UserRepository = AppDataSource.getRepository(User);

export const WhitelistedMenorRepository =
  AppDataSource.getRepository(WhitelistedMentor);

export const LinkRepository = AppDataSource.getRepository(Link);
