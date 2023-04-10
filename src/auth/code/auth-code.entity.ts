import { User } from '../../user/user.entity';
import { CodeType } from './code-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class AuthCode {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    default: false,
  })
  used: boolean;

  @Column({
    enum: CodeType,
  })
  codeType: CodeType;

  @Column()
  code: string;

  @ManyToOne(() => User, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
