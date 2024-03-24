import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserProfile } from "types/db";

@Entity({
  name: "user",
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isMentor: boolean;

  @Column("jsonb", { nullable: false, default: {} })
  profile: UserProfile;
}
