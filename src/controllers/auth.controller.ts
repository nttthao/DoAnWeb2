import { User } from 'src/entities/user.entity';
import { HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  SignUpDto,
  SignInDto,
  VerifyAccountDto,
  RequestForgotPasswordDto,
  CheckActivationCodeDto,
  ChangePasswordDto,
} from '../models/user.dto';
import { UsersService } from 'src/services/users.service';
import { Public } from 'src/constants/app.const';
import { MailerService } from '@nestjs-modules/mailer';

@Public()
@Controller('api/auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() dto: SignInDto): Promise<any> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new HttpException('user-not-exist', HttpStatus.BAD_REQUEST);
    }
    if (!user.isActive) {
      throw new HttpException('user-not-verify-yet', HttpStatus.BAD_REQUEST);
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new HttpException('user-not-exist', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  @Post('sign-up')
  @HttpCode(200)
  async signUp(@Body() dto: SignUpDto): Promise<void> {
    let user = await this.userService.findByEmail(dto.email);
    if (user && user.isActive) {
      throw new HttpException('user-exist', HttpStatus.BAD_REQUEST);
    }

    const code = Math.floor(Math.random() * (99999 - 10000) + 10000);
    user ??= new User();
    user.name = dto.name;
    user.email = dto.email;
    user.password = bcrypt.hashSync(dto.password, 10);
    user.isActive = false;
    user.activationCode = code.toString();

    await this.userService.save(user);

    this.mailerService.sendMail({
      to: user.email,
      subject: '✔ [HCMUS Movie] Verify account',
      template: `${process.cwd()}/templates/verify`,
      context: {
        code: user.activationCode,
        name: user.name,
      },
    });
  }

  @Post('verify')
  @HttpCode(200)
  async verify(@Body() dto: VerifyAccountDto): Promise<any> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new HttpException('user-not-exist', HttpStatus.BAD_REQUEST);
    }
    if (user.isActive) {
      throw new HttpException('user-verified', HttpStatus.BAD_REQUEST);
    }

    if (+user.activationCode !== +dto.code) {
      throw new HttpException('invalid-verify-code', HttpStatus.BAD_REQUEST);
    }

    await this.userService.save({
      ...user,
      isActive: true,
      activationCode: null,
    });
  }

  @Post('forgot-password')
  @HttpCode(200)
  async requestForgotPassword(
    @Body() dto: RequestForgotPasswordDto,
  ): Promise<any> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new HttpException('user-not-exist', HttpStatus.BAD_REQUEST);
    }

    const code = Math.floor(Math.random() * (99999 - 10000) + 10000);
    await this.userService.save({
      ...user,
      activationCode: code.toString(),
    });

    this.mailerService.sendMail({
      to: user.email,
      subject: '✔ [HCMUS Movie] Forgot password',
      template: `${process.cwd()}/templates/forgot-password`,
      context: {
        code,
        name: user.name,
      },
    });
  }

  @Post('check-activation-code')
  @HttpCode(200)
  async checkActivationCode(@Body() dto: CheckActivationCodeDto): Promise<any> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new HttpException('user-not-exist', HttpStatus.BAD_REQUEST);
    }
    
    if (+user.activationCode !== +dto.code) {
      throw new HttpException('wrong-activation-code', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('change-password')
  @HttpCode(200)
  async changePassword(@Body() dto: ChangePasswordDto): Promise<any> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new HttpException('user-not-exist', HttpStatus.BAD_REQUEST);
    }

    if (+user.activationCode !== +dto.code) {
      throw new HttpException('wrong-activation-code', HttpStatus.BAD_REQUEST);
    }

    const password = bcrypt.hashSync(dto.password, 10);

    await this.userService.save({
      ...user,
      password,
      activationCode: null,
      isActive: true,
    });
  }
}
