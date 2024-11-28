import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Mail } from './entities/mail.entity';
import { CreateMailDto } from './dto/create-mail.dto';

@Injectable()
export class MailRepository extends Repository<Mail> {
  constructor(private readonly dataSource: DataSource) {
    super(Mail, dataSource.createEntityManager());
  }

  async createMail(
    mailData: { subject: string; content: string },
    newsletterId: number,
    userId: number,
  ): Promise<Mail> {
    const mail = this.create({ ...mailData, newsletterId, userId });
    return await this.save(mail);
  }
}
