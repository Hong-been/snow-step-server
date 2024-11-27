import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Newsletter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  email: string;

  @Column()
  description: string;

  @Column()
  serviceUrl: string;

  @Column()
  subscriptionUrl: string;

  @Column()
  archiveUrl: string;

  @Column({ default: false })
  isValidated: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
