import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DoctorEntity } from '../doctor/DoctorEntity'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'

@Entity('answer_agreements')
export class PatientQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @CreateDateColumn({ name: 'updated_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientQuestionAnswerEntity, (answer) => answer.id)
  public answer!: PatientQuestionAnswerEntity

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.id)
  public agreedDoctor!: DoctorEntity
}
