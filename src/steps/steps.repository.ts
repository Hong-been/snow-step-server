import { DataSource, Repository } from 'typeorm';
import { Step } from './entities/step.entity';
import { CreateStepDto } from './dto/create-step.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StepsRepository extends Repository<Step> {
  constructor(private dataSource: DataSource) {
    super(Step, dataSource.createEntityManager());
  }

  async createStep(
    createStepDto: CreateStepDto,
    userId: number,
    mailId?: number,
  ) {
    const step = this.create({ ...createStepDto, userId, mailId });
    return await this.save(step);
  }
}
