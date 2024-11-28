import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  create(userId: number, newsletterId: number) {
    return this.subscriptionsRepository.createSubscription(
      userId,
      newsletterId,
    );
  }

  findSubscriptionsByUserId(userId: number) {
    return this.subscriptionsRepository.findSubscriptionsByUserId(userId);
  }

  findSubscriptionsByNewsletterId(newsletterId: number) {
    return this.subscriptionsRepository.findSubscriptionsByNewsletterId(
      newsletterId,
    );
  }

  deleteSubscriptionByUserIdAndNewsletterId(
    userId: number,
    newsletterId: number,
  ) {
    return this.subscriptionsRepository.delete({ userId, newsletterId });
  }
}
