import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("PaymentData")
export class PaymentData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  userId!: string;

  @Column({ nullable: false })
  amount!: number;

  @Column({ nullable: false })
  month!: string;

  @Column({ default: () => "CURRENT_TIMESTAMP", nullable: false })
  payedAt!: Date;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: true })
  photo!: string;
}
