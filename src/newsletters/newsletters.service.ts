import { Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { NewslettersRepository } from './newsletters.repository';

@Injectable()
export class NewslettersService {
  constructor(private readonly newslettersRepository: NewslettersRepository) {}
  async create(createNewsletterDto: CreateNewsletterDto) {
    return await this.newslettersRepository.createNewsletter(
      createNewsletterDto,
    );
  }

  async findAll() {
    return await this.newslettersRepository.find();
  }

  async findOne(id: number) {
    return await this.newslettersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateNewsletterDto: UpdateNewsletterDto) {
    return await this.newslettersRepository.update(id, updateNewsletterDto);
  }

  async remove(id: number) {
    return await this.newslettersRepository.delete(id);
  }
}
