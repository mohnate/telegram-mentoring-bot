import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserProfile } from "types/db";
import { Matches } from "./Matches";

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

  @OneToMany(() => Matches, (match) => match.user)
  matches: Matches[];
}
