import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  picture?: string;

  @Column({
    default: false,
  })
  validEmail: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
