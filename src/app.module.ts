import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AppConfig } from './configs/app.config';
import entities from './entities';
import controllers from './controllers';
import services from './services';
import providers from './providers';
import { JWT_SECRET } from './constants/auth.const';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './passports/jwt.strategy';

console.log(__dirname);

@Module({
  imports: [
    TypeOrmModule.forRoot(AppConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature(entities),
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: process.env.EMAIL_TRANSPORT,
        defaults: {
          from: '"HCMUS Movie" <hcmus-movie@hcmus.edu.vn>',
          sender: 'no-reply@movie.hcmus.edu.vn',
        },
        template: {
          dir: `${__dirname}/templates`,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: controllers,
  providers: [
    ...services,
    ...providers,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
