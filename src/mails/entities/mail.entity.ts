import { User } from 'src/auth/entities/auth.entity';
import { Newsletter } from 'src/newsletters/entities/newsletter.entity';
import { Step } from 'src/steps/entities/step.entity';
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

  // 수신자 이름으로 newsletter를 찾아 연결.
  // DEV Community Newsletter <yo@dev.to>에서 DEV Community Newsletter를 의미
  @ManyToOne((type) => Newsletter, (newsletter) => newsletter.id)
  newsletters: Newsletter;

  @OneToOne((type) => Step, (step) => step.mail, { nullable: true })
  step: Step;
}
