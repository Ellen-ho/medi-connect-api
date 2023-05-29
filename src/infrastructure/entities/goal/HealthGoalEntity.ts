import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'
import { PatientEntity } from '../patient/PatientEntity'
import {
  HealthGoalStatus,
  IBloodPressureValue,
  IHealthGoalResult,
} from '../../../domain/goal/HealthGoal'
import { DoctorEntity } from '../doctor/DoctorEntity'
import { BloodSugarType } from '../../../domain/record/BloodSugarRecord'

@Entity('health_goals')
export class HealthGoalEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    name: 'blood_pressure_target_value',
    type: 'jsonb',
    default: {
      systolicBloodPressure: null,
      diastolicBloodPressure: null,
    },
  })
  public bloodPressureTargetValue!: IBloodPressureValue

  @Column({
    name: 'blood_sugar_target_value',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  public bloodSugarTargetValue!: number

  @Column({
    name: 'blood_sugar_target_type',
    type: 'varchar',
    length: 100,
  })
  public bloodSugarTargetType!: BloodSugarType

  @Column({
    name: 'glycated_hemonglobin_target_value',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  public glycatedHemonglobinTargetValue!: number

  @Column({
    name: 'weight_target_value',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  public weightTargetValue!: number

  @Column({
    name: 'body_mass_index_target_value',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  public bodyMassIndexTargetValue!: number

  @Column({ name: 'start_at' })
  public startAt!: Date

  @Column({ name: 'end_at' })
  public endAt!: Date

  @Column({ name: 'status' })
  public status!: HealthGoalStatus

  @Column({ name: 'result', type: 'jsonb', nullable: true })
  public result!: IHealthGoalResult | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity

  @Column({ name: 'patient_id' })
  @RelationId((healthGoal: HealthGoalEntity) => healthGoal.patient)
  public patientId!: string

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor!: DoctorEntity

  @Column({ name: 'doctor_id', nullable: true })
  @RelationId((healthGoal: HealthGoalEntity) => healthGoal.doctor)
  public doctorId!: string | null
}
