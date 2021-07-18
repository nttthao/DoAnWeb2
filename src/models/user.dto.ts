import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public password: string;
}

export class SignInDto {
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public password: string;
}

export class VerifyAccountDto {
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public code: string;
}

export class RequestForgotPasswordDto {
  @ApiProperty()
  public email: string;
}

export class CheckActivationCodeDto {
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public code: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public code: string;
  @ApiProperty()
  public password: string;
}

export class UpdateUserDto {
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public phone: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  public oldPassword: string;
  @ApiProperty()
  public newPassword: string;
}
