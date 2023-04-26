import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DoctorEntity } from '../doctor/DoctorEntity'
import { PatientQuestionEntity } from './PatientQuestionEntity'

@Entity('patient_question_answers')
export class PatientQuestionAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'content', type: 'varchar', length: 300 })
  public content!: string

  @CreateDateColumn({ name: 'updated_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientQuestionEntity)
  public patientQuestion!: string

  @ManyToOne(() => DoctorEntity)
  public doctor!: string
}
