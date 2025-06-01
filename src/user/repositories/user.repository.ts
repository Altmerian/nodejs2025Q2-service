import { Injectable } from '@nestjs/common';
import { BaseInMemoryRepository } from '../../common/repositories/base.repository';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserRepository extends BaseInMemoryRepository<User> {
  async findByLogin(login: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(user => user.login === login) || null;
  }
}