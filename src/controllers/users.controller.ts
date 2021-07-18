import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { UpdatePasswordDto, UpdateUserDto } from 'src/models/user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../services/users.service';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me')
  async getUserInfo(@Request() req): Promise<any> {
    const user = await this.userService.findById(req.user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
  }

  @Put('me')
  async updateUserInfo(
    @Request() req,
    @Body() dto: UpdateUserDto,
  ): Promise<any> {
    const user = await this.userService.findById(req.user.id);
    user.name = dto.name;
    user.phone = dto.phone;

    await this.userService.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
  }

  @Post('me/change-password')
  @HttpCode(200)
  async changePassword(
    @Request() req,
    @Body() dto: UpdatePasswordDto,
  ): Promise<any> {
    const user = await this.userService.findById(req.user.id);
    const match = await bcrypt.compare(dto.oldPassword, user.password);
    if (!match) {
      throw new HttpException('wrong-old-password', HttpStatus.BAD_REQUEST);
    }

    user.password = bcrypt.hashSync(dto.newPassword, 10);

    await this.userService.save(user);
  }
}
