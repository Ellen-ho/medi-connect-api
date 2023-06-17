import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { MeetingLinkStatus } from '../../../domain/meeting/MeetingLink'

@Entity('meeting_links')
export class MeetingLinkEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'link', unique: true, type: 'varchar', length: 255 })
  public link!: string

  @Column({ name: 'status', type: 'varchar', length: 100 })
  public status!: MeetingLinkStatus

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}
