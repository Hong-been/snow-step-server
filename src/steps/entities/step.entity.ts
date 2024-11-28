import { User } from 'src/auth/entities/auth.entity';
import { Mail } from 'src/mails/entities/mail.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Step extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;

  @Column({ nullable: true })
  mailId: number;

  @ManyToOne(() => User, (user) => user.steps, {
    onDelete: 'CASCADE', // 관련된 User가 삭제되면 Mail도 자동으로 삭제됩니다.
    eager: false,
  })
  user?: User;

  @ManyToOne(() => Mail, (mail) => mail.steps, { nullable: true })
  mail?: Mail;
}
