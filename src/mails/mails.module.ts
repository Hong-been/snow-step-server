import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MailRepository } from './mails.repository';
import { NewslettersRepository } from 'src/newsletters/newsletters.repository';
import { UsersRepository } from 'src/auth/users.repository';

@Module({
  controllers: [MailsController],
  providers: [
    MailsService,
    MailRepository,
    NewslettersRepository,
    UsersRepository,
  ],
})
export class MailsModule {}
