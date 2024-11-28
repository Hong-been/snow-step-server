import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { Mail } from './entities/mail.entity';
import { MailRepository } from './mails.repository';
import { Between } from 'typeorm';

@Injectable()
export class MailsService {
  constructor(private readonly mailRepository: MailRepository) {}
  async create(createMailDto: CreateMailDto) {
    const mail = await this.mailRepository.createMail(createMailDto);
    return mail;
  }

  async findOne(id: number) {
    return this.mailRepository.findOneBy({ id });
  }

  async findByUserAndDate(id: number, date: string): Promise<Mail[]> {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    return this.mailRepository.find({
      where: {
        id,
        receivedAt: Between(startOfDay, endOfDay),
      },
    });
  }

  async update(id: number, updateMailDto: UpdateMailDto) {
    // Find the mail by ID
    const mail = await this.mailRepository.findOne({ where: { id } });

    // If not found, throw an exception
    if (!mail) {
      throw new NotFoundException(`Mail with ID ${id} not found`);
    }

    // Merge the update data into the existing mail entity
    Object.assign(mail, updateMailDto);

    // Save the updated mail entity
    return this.mailRepository.save(mail);
  }
}
