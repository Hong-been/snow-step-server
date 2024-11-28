import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/authGuard';
import { CreateMailDto } from './dto/create-mail.dto';
import { Mail } from './entities/mail.entity';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @ApiOperation({
    summary: '메일 서버에서 메일이 오면 원문을 보낸다. 받아서 처리하는 API',
    description: 'subject, content, from, to, receivedAt을 파싱해서 사용',
  })
  @Post()
  async create(@Body() createMailDto: CreateMailDto) {
    return await this.mailsService.create(createMailDto);
  }

  @ApiOperation({
    summary: '메일 개별 조회. 한번 GET으로 조회하면 읽음처리.',
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    await this.mailsService.update(+id, { isRead: true });
    return await this.mailsService.findOne(+id);
  }

  @ApiOperation({
    summary: '유저 id로 유저를 찾고 date에 받은 메일을 모두 가져온다.',
    description: 'date가 없으면 오늘 날짜로 받아온다. date는 yyyy-mm-dd 형식',
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/users/:id')
  async findAllByUserId(
    @Param('id') id: number,
    @Query('date') date: string,
  ): Promise<Mail[]> {
    return await this.mailsService.findByUserAndDate(id, date);
  }
}
