import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserProfile } from "types/db";

@Entity({
  name: "users",
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegramId: number;

  @Column()
  isMentor: boolean;

  @Column("jsonb", { nullable: false, default: {} })
  profile: UserProfile;
}
