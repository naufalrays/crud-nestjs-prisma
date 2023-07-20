import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get users
   * @returns
   */
  @Get()
  async users() {
    return await this.userService.findAll();
  }

  /**
   * Create user
   * @param body
   * @returns
   */
  @Post()
  async createUser(@Body() body) {
    return await this.userService.createUser(body);
  }

  /**
   * Update user
   * @param id
   * @param body
   * @returns
   */
  @UsePipes(ValidationPipe)
  @Put('/:id')
  async updateUser(@Param('id', ParseIntPipe) id, @Body() body) {
    return await this.userService.updateUser(id, body);
  }

  /**
   * Delete user
   * @param id
   * @returns
   */
  @UsePipes(ValidationPipe)
  @Delete('/:id')
  async deteleUser(@Param('id', ParseIntPipe) id) {
    return await this.userService.deleteUser(id);
  }
}
