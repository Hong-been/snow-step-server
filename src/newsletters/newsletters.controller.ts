import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/authGuard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Newsletter } from './entities/newsletter.entity';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '뉴스레터 생성',
    description: '로그인된 유저의 뉴스레터 생성',
  })
  @ApiResponse({
    status: 200,
    description: '뉴스레터 생성 성공',
  })
  @Post()
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newslettersService.create(createNewsletterDto);
  }

  @ApiOperation({
    summary: '뉴스레터 전체 조회',
    description: '로그인된 유저의 뉴스레터 전체 조회',
  })
  @ApiResponse({
    status: 200,
    description: '뉴스레터 전체 조회 성공',
    type: [Newsletter],
  })
  @Get()
  findAll() {
    return this.newslettersService.findAll();
  }

  @ApiOperation({
    summary: '뉴스레터 단일 조회',
    description: '로그인된 유저의 뉴스레터 단일 조회',
  })
  @ApiResponse({
    status: 200,
    description: '뉴스레터 단일 조회 성공',
    type: Newsletter,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newslettersService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '뉴스레터 수정',
    description: '로그인된 유저의 뉴스레터 수정',
  })
  @ApiResponse({
    status: 200,
    description: '뉴스레터 수정 성공',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsletterDto: UpdateNewsletterDto,
  ) {
    return this.newslettersService.update(+id, updateNewsletterDto);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '뉴스레터 삭제',
    description: '로그인된 유저의 뉴스레터 삭제',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newslettersService.remove(+id);
  }
}
