import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { Mail } from './entities/mail.entity';

@Injectable()
export class MailsService {
  create(createMailDto: CreateMailDto) {
    return 'This action adds a new mail';
  }

  findAll() {
    return `This action returns all mails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  findByUserAndDate(id: number, date: string): Promise<Mail[]> {
    return;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }
}
