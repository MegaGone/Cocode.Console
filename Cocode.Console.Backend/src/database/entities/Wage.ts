import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("WageData")
export class WageData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ type: "nvarchar", nullable: false, length: "255" })
  User!: string;

  @Column({ type: "decimal", nullable: false })
  Amount!: number;

  @Column({ type: "int", default: 1, nullable: false })
  Status!: number;

  @Column({ type: "varchar", nullable: false, length: "25" })
  Service!: string;

  @Column({ type: "varchar", nullable: false, length: "100" })
  Description!: string;

  @CreateDateColumn({ default: () => "GETUTCDATE()", nullable: false })
  CreatedAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  DeletedAt?: Date | null;
}
