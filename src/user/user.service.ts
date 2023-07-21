import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(private dbService: PrismaService) {}

  /**
   * get all user
   * @returns
   */
  async findAll(): Promise<User[]> {
    return await this.dbService.user.findMany();
  }

  /**
   * create user
   * @param data
   */
  async createUser(data: User): Promise<User> {
    const existingUsername = await this.dbService.user.findUnique({
      where: {
        username: data.username,
      },
    });
    const existingEmail = await this.dbService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // If username existing
    if (existingUsername != null) {
      throw new ConflictException('Username already exists');
    }

    // If email existing
    if (existingEmail != null) {
      throw new ConflictException('Email already exists');
    }

    return this.dbService.user.create({
      data,
    });
  }

  /**
   * Update user
   * @param id
   * @param data
   * @returns
   */
  async updateUser(id: number, data: any) {
    return await this.dbService.user.update({
      data,
      where: {
        id,
      },
    });
  }

  /**
   * Delete user
   * @param id
   * @returns
   */
  async deleteUser(id: number) {
    return await this.dbService.user.delete({
      where: {
        id,
      },
    });
  }
}
