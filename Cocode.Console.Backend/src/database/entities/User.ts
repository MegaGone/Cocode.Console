import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("UserData")
export class UserData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  DisplayName!: string;

  @Column({ unique: true, nullable: false })
  Email!: string;

  @Column({ nullable: false })
  Role!: number;

  @Column({ nullable: false })
  Password!: string;

  @Column({ default: () => "CURRENT_TIMESTAMP", nullable: false })
  createdAt!: Date;

  @Column({ default: false, nullable: false })
  IsSolvent!: boolean;

  @Column({ nullable: false })
  Dpi!: string;
}
