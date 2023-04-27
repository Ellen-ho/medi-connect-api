import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DoctorEntity } from '../doctor/DoctorEntity'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'

@Entity('answer_agreements')
export class AnswerAgreementEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'comment', type: 'varchar', length: 400 })
  public comment!: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientQuestionAnswerEntity, (answer) => answer.id)
  @JoinColumn({ name: 'patient_question_answer_id' })
  public answer!: PatientQuestionAnswerEntity

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.id)
  @JoinColumn({ name: 'agreed_doctor_id' })
  public agreedDoctor!: DoctorEntity
}
