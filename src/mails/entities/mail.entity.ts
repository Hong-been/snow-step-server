import { User } from 'src/auth/entities/auth.entity';
import { Newsletter } from 'src/newsletters/entities/newsletter.entity';
import { Step } from 'src/steps/entities/step.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column()
  userId: number; // User 엔티티의 ID만 저장

  @Column({ nullable: true })
  newsletterId: number; // 연결된 뉴스레터의 ID, 없을 수 있음

  // 발신자 이메일로 user를 찾아 연결
  @ManyToOne(() => User, (user) => user.mails, {
    onDelete: 'CASCADE', // 관련된 User가 삭제되면 Mail도 자동으로 삭제됩니다.
    eager: false,
  })
  user?: User; // Optional: 필요할 때만 User 객체를 로드

  @ManyToOne(() => Newsletter, (newsletter) => newsletter.mails, {
    eager: false,
  })
  newsletter?: Newsletter;

  @OneToMany(() => Step, (step) => step.mail, { nullable: true, eager: false })
  steps?: Step[];
}
