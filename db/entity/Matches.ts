import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity({
  name: "matches",
})
export class Matches {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  mentorId: number;

  @Column()
  matching: boolean;

  @Column()
  accepted: boolean;

  @ManyToOne(() => User, (user) => user.matches)
  @JoinColumn({ name: "userId" }) // This column in the Matches table refers to the User entity.
  user: User;
}
