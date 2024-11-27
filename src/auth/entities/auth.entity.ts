import { Mail } from 'src/mails/entities/mail.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email', 'userName'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  email: string;

  // ${userName}@snowstep.com 으로 사용
  @Column({ length: 255, unique: true })
  userName: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255, nullable: true })
  picture: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany((type) => Mail, (mail) => mail.user)
  mails: Mail[];
}
