import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/auth.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.create(userData); // 엔티티 생성
    return await this.save(user);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return await this.findOneBy({ username });
  }
}
