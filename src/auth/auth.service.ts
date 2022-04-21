import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  create(dto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByCond({
      email,
      password,
    });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  generetJwtToken(data: { id: number; email: string }) {
    const payload = { email: data.email, sub: data.id };
    return this.jwtService.sign(payload);
  }

  async login(user: UserEntity) {
    const { password, ...userData } = user;
    return {
      ...userData,
      token: this.generetJwtToken(userData),
    };
  }

  async register(dto: CreateUserDto) {
    try {
      const { password, ...user } = await this.userService.create(dto);
      return {
        ...user,
        token: this.generetJwtToken(user),
      };
    } catch (err) {
      throw new ForbiddenException('Ощибка при регистрации');
    }
  }
}
