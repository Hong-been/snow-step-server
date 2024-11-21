import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('status')
@ApiTags('Status')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get status' }) // API의 요약 정보
  @ApiResponse({ status: 200, description: 'Success' }) // 응답 상태에 대한 설명
  getHello(): string {
    return this.appService.getHello();
  }
}
