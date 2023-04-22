import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { BloodSugarUnitType } from '../../../domain/record/BloodSugarRecord'
import { PatientEntity } from '../patient/PatientEntity'

@Entity('blood_sugar_records')
export class BloodSugarRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'blood_sugar_date' })
  public bloodSugarDate!: Date

  @Column({ name: 'blood_sugar_value', type: 'int' })
  public bloodSugarValue!: number

  @Column({ name: 'blood_sugar_unit', type: 'varchar', length: 20 })
  public bloodSugarUnit!: BloodSugarUnitType

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
