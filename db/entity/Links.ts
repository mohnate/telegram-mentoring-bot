import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: "links",
})
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  mentorId: number;

  @Column()
  isAccepted: boolean;
}
