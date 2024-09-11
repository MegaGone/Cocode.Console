import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("NotificationLogData")
export class NotificationData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "nvarchar", length: 255 })
  user!: string;

  @Column({ length: 500 })
  message!: string;

  @Column({ default: false })
  viewed!: boolean;

  @Column({ default: false })
  deleted!: boolean;

  @CreateDateColumn({ type: "datetime", default: () => "GETUTCDATE()" })
  createdAt!: Date;

  @Column({ nullable: false })
  type!: number;
}
