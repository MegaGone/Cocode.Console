import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("MinuteData")
export class MinuteData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ type: "varchar", nullable: false, length: "255" })
  Author!: string;

  @Column({ type: "varchar", nullable: false, length: "100" })
  Filename!: string;

  @Column({ type: "varchar", nullable: false, length: "100" })
  Description!: string;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP", nullable: false })
  CreatedAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  DeletedAt?: Date | null;
}
