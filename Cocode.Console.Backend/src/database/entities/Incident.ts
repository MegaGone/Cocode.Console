import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("IncidentData")
export class IncidentData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  incidentName!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ type: "nvarchar", nullable: false, length: 255 })
  user!: string;

  @Column({ nullable: true, length: "max" })
  incidentEvidence!: string;
}
