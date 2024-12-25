import { Controller, Get, Param } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }
}
