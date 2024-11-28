import { Injectable } from '@nestjs/common';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { StepsRepository } from './steps.repository';

@Injectable()
export class StepsService {
  constructor(private readonly stepsRepository: StepsRepository) {}

  async create(createStepDto: CreateStepDto, userId: number, mailId?: number) {
    return await this.stepsRepository.createStep(createStepDto, userId, mailId);
  }

  findAllByUser(userId: number, page?: number) {
    return this.stepsRepository.find({
      where: { userId },
      take: 20,
      skip: (page - 1) * 20,
    });
  }

  async findOne(id: number) {
    return await this.stepsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateStepDto: UpdateStepDto) {
    return await this.stepsRepository.update(id, updateStepDto);
  }

  async remove(id: number) {
    return await this.stepsRepository.delete(id);
  }
}
