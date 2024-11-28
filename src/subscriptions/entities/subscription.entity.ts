import { User } from 'src/auth/entities/auth.entity';
import { Newsletter } from 'src/newsletters/entities/newsletter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  newsletterId: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user?: User;

  @ManyToOne(() => Newsletter, (newsletter) => newsletter.subscription)
  newsletter?: Newsletter;

  @CreateDateColumn()
  createdAt: Date;
}
