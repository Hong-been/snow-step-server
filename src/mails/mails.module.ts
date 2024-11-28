import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MailRepository } from './mails.repository';

@Module({
  controllers: [MailsController],
  providers: [MailsService, MailRepository],
})
export class MailsModule {}
