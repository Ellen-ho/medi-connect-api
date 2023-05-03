import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'

import { UserEntity } from '../user/UserEntity'
import { GenderType } from '../../../domain/patient/Patient'
import { IAddress } from '../../../domain/doctor/Doctor'

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public avatar!: string | null

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  public firstName!: string

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  public lastName!: string

  @Column({ name: 'gender', type: 'varchar', length: 20 })
  public gender!: GenderType

  @Column({ name: 'about_me', type: 'varchar', length: 400 })
  public aboutMe!: string

  @Column({ name: 'languages_spoken', type: 'jsonb' })
  public languagesSpoken!: string[]

  @Column({ name: 'specialties', type: 'jsonb' })
  public specialties!: string[]

  @Column({ name: 'career_start_date' })
  public careerStartDate!: Date

  @Column({ name: 'office_practical_location', type: 'jsonb' })
  public officePracticalLocation!: IAddress

  @Column({ name: 'education', type: 'jsonb' })
  public education!: string[]

  @Column({ name: 'awards', type: 'jsonb', nullable: true })
  public awards!: string[] | null

  @Column({ name: 'affiliations', type: 'jsonb', nullable: true })
  public affiliations!: string[] | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity
}
