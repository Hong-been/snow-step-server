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
} from '@nestjs/common';
import { MailsService } from './mails.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/authGuard';
import { Mail } from './entities/mail.entity';

@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Post()
  create(@Body() createMailDto: CreateMailDto) {
    return this.mailsService.create(createMailDto);
  }

  @Get()
  findAll() {
    return this.mailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailsService.findOne(+id);
  }

  @ApiOperation({
    summary: '유저 id로 유저를 찾고 date에 받은 메일을 모두 가져온다.',
    description: 'date가 없으면 오늘 날짜로 받아온다.',
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  async findAllByUserId(
    @Param('id') id: number,
    @Query('date') date: string,
  ): Promise<Mail[]> {
    const mails = await this.mailsService.findByUserAndDate(id, date);
    return mails;
  }

  @Patch('/:id/isRead')
  updateToBeRead(@Param('id') id: string) {
    return this.mailsService.update(+id, { isRead: true });
  }
}
