import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PatientEntity } from '../patient/PatientEntity'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'

@Entity('answer_apprieciations')
export class AnswerAppreciationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'content', type: 'varchar', length: 300, nullable: true })
  public content!: string

  @CreateDateColumn({ name: 'updated_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity, (patient) => patient.id)
  public patient!: PatientEntity

  @ManyToOne(() => PatientQuestionAnswerEntity, (answer) => answer.id)
  public answer!: PatientQuestionAnswerEntity
}
