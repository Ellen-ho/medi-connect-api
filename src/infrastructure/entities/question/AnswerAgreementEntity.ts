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
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'

@Entity('answer_agreements')
export class AnswerAgreementEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'comment', type: 'text', length: 500, nullable: true })
  public comment!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt?: Date

  @ManyToOne(() => PatientQuestionAnswerEntity, (answer) => answer.id)
  @JoinColumn({ name: 'patient_question_answer_id' })
  public answer!: PatientQuestionAnswerEntity

  @Column({ name: 'patient_question_answer_id' })
  @RelationId(
    (answerAgreement: AnswerAgreementEntity) => answerAgreement.answer
  )
  public answerId!: string

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.id)
  @JoinColumn({ name: 'agreed_doctor_id' })
  public agreedDoctor!: DoctorEntity

  @Column({ name: 'agreed_doctor_id' })
  @RelationId(
    (answerAgreement: AnswerAgreementEntity) => answerAgreement.agreedDoctor
  )
  public agreedDoctorId!: string
}
