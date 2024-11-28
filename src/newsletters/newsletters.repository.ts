import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';

@Injectable()
export class NewslettersRepository extends Repository<Newsletter> {
  constructor(private readonly dataSource: DataSource) {
    super(Newsletter, dataSource.createEntityManager());
  }

  async createNewsletter(
    newsletterData: CreateNewsletterDto,
  ): Promise<Newsletter> {
    const newsletter = this.create(newsletterData);
    return await this.save(newsletter);
  }

  async findNewsletterByName(name: string): Promise<Newsletter> {
    return await this.findOneBy({ name });
  }
}
