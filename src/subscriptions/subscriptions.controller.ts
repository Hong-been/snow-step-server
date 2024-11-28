import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/authGuard';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiOperation({ summary: '구독 생성' })
  @ApiResponse({
    status: 201,
    description: '구독 생성 성공',
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createSubscription(
    @Body('userId') userId: number,
    @Body('newsletterId') newsletterId: number,
  ) {
    return this.subscriptionsService.create(userId, newsletterId);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '유저 구독 조회' })
  @ApiResponse({
    status: 200,
    description: '구독 조회 성공',
  })
  @Get('user/:userId')
  findSubscriptionsByUserId(@Param('userId') userId: number) {
    return this.subscriptionsService.findSubscriptionsByUserId(userId);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '뉴스레터 구독 조회' })
  @ApiResponse({
    status: 200,
    description: '구독 조회 성공',
  })
  @Get('newsletter/:newsletterId')
  findSubscriptionsByNewsletterId(@Param('newsletterId') newsletterId: number) {
    return this.subscriptionsService.findSubscriptionsByNewsletterId(
      newsletterId,
    );
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '구독 삭제' })
  @ApiResponse({
    status: 200,
    description: '구독 삭제 성공',
  })
  @Delete('user/:userId/newsletter/:newsletterId')
  deleteSubscriptionByUserIdAndNewsletterId(
    @Param('userId') userId: number,
    @Param('newsletterId') newsletterId: number,
  ) {
    return this.subscriptionsService.deleteSubscriptionByUserIdAndNewsletterId(
      userId,
      newsletterId,
    );
  }
}
