import { Module } from '@nestjs/common';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { StepsRepository } from './steps.repository';

@Module({
  controllers: [StepsController],
  providers: [StepsService, StepsRepository],
})
export class StepsModule {}
