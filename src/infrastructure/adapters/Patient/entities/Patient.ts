import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('patients')
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'avatar', type: 'varchar', length: 100 })
  public avatar!: string

  @Column({ name: 'firstName', type: 'varchar', length: 20 })
  public firstName!: string

  @Column({ name: 'lastName', type: 'varchar', length: 20 })
  public lastName!: string

  @Column({ name: 'birthDate', type: 'varchar', length: 20 })
  public birthDate!: string

  @Column({ name: 'gender', type: 'varchar', length: 20 })
  public gender!: string

  @Column({ name: 'medicalHistory', type: 'varchar', length: 100 })
  public medicalHistory!: string

  @Column({ name: 'allergy', type: 'varchar', length: 100 })
  public allergy!: string

  @Column({ name: 'familyHistory', type: 'varchar', length: 100 })
  public familyHistory!: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}


