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

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
  public avatar!: string | null

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  public firstName!: string

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  public lastName!: string

  @Column({ name: 'gender', type: 'varchar', length: 20 })
  public gender!: GenderType

  @Column({ name: 'about_me', type: 'varchar', length: 400 })
  public aboutMe!: string

  @Column({ name: 'based_in', type: 'varchar', length: 100 })
  public basedIn!: string

  @Column({ name: 'languages_spoken', type: 'varchar', length: 100 })
  public languagesSpoken!: string

  @Column({ name: 'specialties', type: 'varchar', length: 255 })
  public specialties!: string

  @Column({ name: 'years_of_experience', type: 'number', length: 20 })
  public yearsOfExperience!: number

  @Column({ name: 'office_practical_location', type: 'varchar', length: 255 })
  public officePracticalLocation!: string

  @Column({ name: 'education', type: 'varchar', length: 255 })
  public education!: string

  @Column({ name: 'awards', type: 'varchar', length: 255 })
  public awards!: string | null

  @Column({ name: 'affiliations', type: 'varchar', length: 255 })
  public affiliations!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity
}
