import { User } from 'src/auth/entities/auth.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Mail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  subject: string;

  @Column({ length: 255 })
  from: string;

  @Column()
  content: string;

  @Column()
  receivedAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // 발신자 이메일로 user를 찾아 연결
  @ManyToOne((type) => User, (user) => user.mails)
  user: User;
}
