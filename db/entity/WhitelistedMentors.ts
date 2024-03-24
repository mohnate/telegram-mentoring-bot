import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: "whitelisted_mentors",
})
export class WhitelistedMentor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}
