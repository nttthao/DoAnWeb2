import { plainToClass } from 'class-transformer';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const environments = ['development', 'test', 'production'] as const;
type Environment = typeof environments[number];

class EnvironmentVariables {
  NODE_ENV: Environment;

  PORT: number;

  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
}

export class AppConfig {
  public static get env(): EnvironmentVariables {
    return plainToClass(EnvironmentVariables, process.env, {
      enableImplicitConversion: true,
    });
  }

  public static getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.env.DB_HOST,
      port: this.env.DB_PORT || 5432,
      username: this.env.DB_USERNAME,
      password: this.env.DB_PASSWORD,
      database: this.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      entities: ['dist/**/*.entity.js'],
      migrationsTableName: 'migrations',
      migrations: ['dist/migrations/*.js'],
      cli: {
        migrationsDir: 'src/migrations',
      },
    };
  }
}
