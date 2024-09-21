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

  @Column({ nullable: true, length: "max" })
  photo!: string;

  @Column({ nullable: false })
  serviceId!: number;

  @Column({ nullable: false })
  recipe!: string;

  @Column({ type: "int", default: 1 })
  state!: number;
}
