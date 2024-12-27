import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AccessToken } from './types/access-token.type';
import { RegisterRequestDTO } from './dto/register-request.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const tokens = await this.getTokens(user.id, user.email);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    await this.tokensService.createRefreshToken(user.id, expirationDate);

    return tokens;
  }

  async register(user: RegisterRequestDTO): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser: any = { ...user, password: hashedPassword };
    await this.usersService.create(newUser);
    delete newUser.password;
    return this.login(newUser);
  }

  async getTokens(userId: number, email: string): Promise<any> {
    const jwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
