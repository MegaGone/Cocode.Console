import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("ServiceData")
export class ServiceData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  Name!: string;

  @Column({ default: true, nullable: false })
  IsEnabled!: boolean;

  @Column({ default: () => "CURRENT_TIMESTAMP", nullable: false })
  CreatedAt!: Date;
}
