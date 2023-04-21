import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'name', unique: true, type: 'varchar', length: 20 })
  public name!: string

  @Column({ name: 'email', unique: true, type: 'varchar', length: 100 })
  public email!: string

  @Column({ name: 'password', type: 'varchar', length: 255 })
  public password!: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date
}
