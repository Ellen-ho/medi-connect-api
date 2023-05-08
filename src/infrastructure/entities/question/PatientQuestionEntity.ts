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
import { MedicalSpecialtyType } from '../../../domain/question/PatientQuestion'
import { PatientEntity } from '../patient/PatientEntity'

@Entity('patient_questions')
export class PatientQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'content', type: 'varchar', length: 300 })
  public content!: string

  @Column({ name: 'medical_specialty', type: 'varchar', length: 50 })
  public medicalSpecialty!: MedicalSpecialtyType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt?: Date

  @ManyToOne(() => PatientEntity, (patient) => patient.id)
  @JoinColumn({ name: 'asker_id' })
  public asker!: PatientEntity

  @Column({ name: 'asker_id' })
  @RelationId((patientQuestion: PatientQuestionEntity) => patientQuestion.asker)
  public askerId!: string
}
