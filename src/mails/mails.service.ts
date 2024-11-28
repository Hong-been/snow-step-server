import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { Mail } from './entities/mail.entity';
import { MailRepository } from './mails.repository';
import { Between } from 'typeorm';
import { NewslettersRepository } from 'src/newsletters/newsletters.repository';
import { UsersRepository } from 'src/auth/users.repository';

@Injectable()
export class MailsService {
  constructor(
    private readonly mailRepository: MailRepository,
    private readonly newslettersRepository: NewslettersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async create(createMailDto: CreateMailDto) {
    const { subject, content, from, to } = createMailDto;
    const fromName = from.match(/^(.+) </)?.[1];
    const fromEmail = from.match(/<(.+)>/)?.[1];
    const username = to.split('@')[0];
    // newsletter에 등록된거면 해당 newsletterId를 저장.
    // 등록안된거면 등록.
    const foundNewsletter =
      await this.newslettersRepository.findNewsletterByName(fromName);

    let newsletterId: number;

    if (!foundNewsletter) {
      const createdNewsletter =
        await this.newslettersRepository.createNewsletter({
          name: fromName,
          email: fromEmail,
        });
      newsletterId = createdNewsletter.id;
      // TODO: 새로운 뉴스레터 등록 슬랙 알림 설정
    } else {
      newsletterId = foundNewsletter.id;
    }

    const userId = await this.usersRepository.findUserByUsername(username);

    const mail = await this.mailRepository.createMail(
      { subject, content },
      newsletterId,
      userId.id,
    );
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
        createdAt: Between(startOfDay, endOfDay),
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
