import { User } from 'src/auth/entities/auth.entity';
import { Newsletter } from 'src/newsletters/entities/newsletter.entity';
import { CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.mails)
  user: User;

  @ManyToOne((type) => Newsletter, (newsletter) => newsletter.id)
  newsletters: Newsletter;

  @CreateDateColumn()
  createdAt: Date;
}
