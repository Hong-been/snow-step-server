import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/authGuard';
import { User } from 'src/auth/entities/auth.entity';
import { Request } from 'express';
import { Step } from './entities/step.entity';

@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '스텝 생성',
    description:
      '로그인된 유저의 스텝 생성. MailId가 있으면 메일의 스텝으로 생성, 없으면 mailId null',
  })
  @ApiResponse({
    status: 201,
    description: '스텝 생성 성공',
    type: Step,
  })
  @Post()
  create(
    @Body() createStepDto: CreateStepDto,
    @Req() req: Request,
    @Query('mailId') mailId?: number,
  ) {
    const user = req.user as User;
    return this.stepsService.create(createStepDto, user.id, mailId);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '스텝 전체 조회',
    description: '로그인된 유저의 스텝 전체 조회. 페이지네이션 적용',
  })
  @ApiResponse({
    status: 200,
    description: '스텝 전체 조회 성공',
    type: [Step],
  })
  @Get()
  findAllByUser(@Req() req: Request, @Query('page') page = 1) {
    const user = req.user as User;
    return this.stepsService.findAllByUser(user.id, page);
  }

  @ApiOperation({
    summary: '스텝 단일 조회',
    description: '로그인된 유저의 스텝 단일 조회',
  })
  @ApiResponse({
    status: 200,
    description: '스텝 단일 조회 성공',
    type: Step,
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.stepsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '스텝 수정',
    description: '로그인된 유저의 스텝 수정',
  })
  @ApiResponse({
    status: 200,
    description: '스텝 수정 성공',
    type: Step,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStepDto: UpdateStepDto) {
    return this.stepsService.update(+id, updateStepDto);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '스텝 삭제',
    description: '로그인된 유저의 스텝 삭제',
  })
  @ApiResponse({
    status: 200,
    description: '스텝 삭제 성공',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stepsService.remove(+id);
  }
}
