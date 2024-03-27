import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: "ongoing_commands",
})
export class OngoingCommand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  stepId: number;

  @Column()
  command: string;

  @Column()
  chatId: number;
}
