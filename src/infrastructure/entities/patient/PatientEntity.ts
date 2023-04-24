import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import {
  GenderType,
  IAllergy,
  IFamilyHistoryItem,
  IMedicalHistoryItem,
  IMedicinceUsageItem,
} from '../../../domain/patient/Patient'
import { UserEntity } from '../user/UserEntity'

@Entity('patients')
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
  public avatar!: string | null

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  public firstName!: string

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  public lastName!: string

  @Column({ name: 'birth_date' })
  public birthDate!: Date

  @Column({ name: 'gender', type: 'varchar', length: 20 })
  public gender!: GenderType

  @Column({ name: 'medical_history', type: 'jsonb', nullable: true })
  public medicalHistory!: IMedicalHistoryItem[] | null

  @Column({ name: 'allergy', type: 'jsonb' })
  public allergy!: IAllergy

  @Column({ name: 'family_history', type: 'jsonb', nullable: true })
  public familyHistory!: IFamilyHistoryItem[] | null

  @Column({
    name: 'height_value_cm',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0,
  })
  public heightValueCm!: number

  @Column({ name: 'medicince_usage', type: 'jsonb', nullable: true })
  public medicinceUsage!: IMedicinceUsageItem[] | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity
}
