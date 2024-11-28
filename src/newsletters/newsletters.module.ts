import { Module } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { NewslettersController } from './newsletters.controller';
import { NewslettersRepository } from './newsletters.repository';

@Module({
  controllers: [NewslettersController],
  providers: [NewslettersService, NewslettersRepository],
})
export class NewslettersModule {}
