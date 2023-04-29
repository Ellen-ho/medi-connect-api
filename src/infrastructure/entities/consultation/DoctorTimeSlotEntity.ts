import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DoctorEntity } from '../doctor/DoctorEntity'

@Entity('doctor_time_slots')
export class DoctorTimeSlotEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @CreateDateColumn({ name: 'start_at' })
  public startAt!: Date

  @CreateDateColumn({ name: 'end_at' })
  public endAt!: Date

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor!: DoctorEntity
}
