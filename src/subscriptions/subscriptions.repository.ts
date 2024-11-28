import { DataSource, Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionsRepository extends Repository<Subscription> {
  constructor(private readonly dataSource: DataSource) {
    super(Subscription, dataSource.createEntityManager());
  }

  async findSubscriptionsByUserIdAndNewsletterId(
    userId: number,
    newsletterId: number,
  ): Promise<Subscription> {
    return await this.findOneBy({ userId, newsletterId });
  }

  async findSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    return await this.find({
      where: { userId },
      relations: { newsletter: true },
    });
  }

  async findSubscriptionsByNewsletterId(
    newsletterId: number,
  ): Promise<Subscription[]> {
    return await this.find({
      where: { newsletterId },
      relations: { newsletter: true },
    });
  }

  async createSubscription(
    userId: number,
    newsletterId: number,
  ): Promise<Subscription> {
    const subscription = this.create({ userId, newsletterId });
    return await this.save(subscription);
  }
}
