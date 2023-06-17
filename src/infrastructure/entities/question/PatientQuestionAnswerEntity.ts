import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'
import { DoctorEntity } from '../doctor/DoctorEntity'
import { PatientQuestionEntity } from './PatientQuestionEntity'

@Entity('patient_question_answers')
export class PatientQuestionAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'content', type: 'text' })
  public content!: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt?: Date

  @ManyToOne(() => PatientQuestionEntity, { nullable: false })
  @JoinColumn({ name: 'patient_question_id' })
  public patientQuestion!: PatientQuestionEntity

  @Column({ name: 'patient_question_id' })
  @RelationId(
    (patientQuestionAnswer: PatientQuestionAnswerEntity) =>
      patientQuestionAnswer.patientQuestion
  )
  public patientQuestionId!: string

  @ManyToOne(() => DoctorEntity, { nullable: false })
  @JoinColumn({ name: 'doctor_id' })
  public doctor!: DoctorEntity

  @Column({ name: 'doctor_id' })
  @RelationId(
    (patientQuestionAnswer: PatientQuestionAnswerEntity) =>
      patientQuestionAnswer.doctor
  )
  public doctorId!: string
}
