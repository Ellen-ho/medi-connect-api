import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {
  GenderType,
  HeightUnitType,
  IAllergy,
  IFamilyHistoryItem,
  IMedicalHistoryItem,
  IMedicinceUsageItem,
} from '../../../domain/patient/Patient'

@Entity('patients')
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'avatar', type: 'varchar', length: 255 })
  public avatar!: string

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  public firstName!: string

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  public lastName!: string

  @Column({ name: 'birth_date' })
  public birthDate!: Date

  @Column({ name: 'gender', type: 'varchar', length: 20 })
  public gender!: GenderType

  @Column({ name: 'medical_history', type: 'jsonb' })
  public medicalHistory!: IMedicalHistoryItem[]

  @Column({ name: 'allergy', type: 'jsonb' })
  public allergy!: IAllergy

  @Column({ name: 'family_history', type: 'jsonb' })
  public familyHistory!: IFamilyHistoryItem[]

  @Column({ name: 'height', type: 'number', length: 20 })
  public height!: number

  @Column({ name: 'height', type: 'varchar', length: 20 })
  public heightUnit!: HeightUnitType

  @Column({ name: 'medicince_usage', type: 'jsonb' })
  public medicinceUsage!: IMedicinceUsageItem[]

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}
