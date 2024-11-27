import { User } from 'src/auth/entities/auth.entity';
import { Mail } from 'src/mails/entities/mail.entity';
import { Newsletter } from 'src/newsletters/entities/newsletter.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
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

  @ManyToOne((type) => User, (user) => user.steps)
  user: User;

  @OneToOne((type) => Mail, (mail) => mail.step, { nullable: true })
  mail: Mail;
}
