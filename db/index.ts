import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { setupMigrations } from "./setup-migrations";

export const setupDb = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    await setupMigrations();
    await AppDataSource.runMigrations({ transaction: "each" });
  }
};

export const UserRepository = AppDataSource.getRepository(User);
