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

@Entity('doctor_time_slots')
export class DoctorTimeSlotEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'start_at', type: 'timestamp' })
  public startAt!: Date

  @Column({ name: 'end_at', type: 'timestamp' })
  public endAt!: Date

  @Column({ name: 'availability', type: 'boolean', default: true })
  public availability!: boolean

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt!: Date | null

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  public doctor!: DoctorEntity

  @Column({ name: 'doctor_id' })
  @RelationId((doctorTimeSlot: DoctorTimeSlotEntity) => doctorTimeSlot.doctor)
  public doctorId!: string
}
