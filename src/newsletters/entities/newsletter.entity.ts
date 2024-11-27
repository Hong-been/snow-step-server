import { Mail } from 'src/mails/entities/mail.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import {
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class Newsletter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  serviceUrl: string;

  @Column({ nullable: true })
  subscriptionUrl: string;

  @Column({ nullable: true })
  archiveUrl: string;

  @Column({ default: false })
  isValidated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany((type) => Mail, (mail) => mail.newsletters)
  mail: Mail;

  @OneToMany((type) => Subscription, (subscription) => subscription.newsletters)
  subscription: Subscription;
}
