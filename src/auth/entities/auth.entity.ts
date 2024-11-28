import { Mail } from 'src/mails/entities/mail.entity';
import { Step } from 'src/steps/entities/step.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email', 'username'])
export class User {
  // BaseEntity를 상속받으면 TypeORM의 Active Record 패턴이 적용되는데, NestJS에서는 Repository 패턴을 사용하는 경우가 더 일반적입니다.
  // 만약 Repository 패턴을 사용 중이라면 BaseEntity를 제거하고 단순히 엔티티 클래스로 작성하는 것이 권장됩니다.
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, unique: true })
  username: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  // TypeORM에서 nullable: true를 설정하면 string | null을 명시하지 않아도 됩니다.
  @Column({ length: 255, nullable: true })
  picture: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Mail, (mail) => mail.user)
  mails: Mail[];

  @OneToMany(() => Step, (step) => step.user)
  steps: Step[];
}
