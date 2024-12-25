import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    delete user.password;

    return user;
  }

  async findOneByEmail(email: string): Promise<any | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(data: CreateUserDto): Promise<any> {
    const newUser = this.usersRepository.create(data);

    return this.usersRepository.save(newUser);
  }
}
