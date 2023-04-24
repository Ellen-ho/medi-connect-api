import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { PatientEntity } from '../patient/PatientEntity'

@Entity('blood_sugar_records')
export class BloodSugarRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'blood_sugar_date' })
  public bloodSugarDate!: Date

  @Column({ name: 'blood_sugar_value_mmol', type: 'int' })
  public bloodSugarValueMmol!: number

  @Column({ name: 'blood_sugar_note', type: 'varchar', length: 150 })
  public bloodSugarNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity
}
