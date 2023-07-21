import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUsersDto } from './dto/register-user.dto';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const users = await this.dbService.user.findUnique({
      where: { username },
    });

    if (!users) {
      throw new NotFoundException('User not found');
    }

    const validatePassword = await bcrypt.compare(password, users.password);

    if (!validatePassword) {
      throw new NotFoundException('Invalid Password');
    }

    return {
      token: this.jwtService.sign({ username }),
    };
  }

  async register(createDto: RegisterUsersDto): Promise<any> {
    const createUser = new User();
    createUser.name = createDto.name;
    createUser.email = createDto.email;
    createUser.username = createDto.username;
    createUser.password = await bcrypt.hash(createDto.password, 10);

    const user = await this.userService.createUser(createUser);
    console.log(user.username);
    const jwtToken = await this.jwtService.signAsync({
      username: user.username,
    });
    console.log(jwtToken);

    return {
      token: this.jwtService.sign({ username: user.username }),
    };
  }
}
