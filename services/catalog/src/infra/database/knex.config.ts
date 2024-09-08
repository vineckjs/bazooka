import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';

@Injectable()
export class KnexConfigService {
  constructor(private configService: ConfigService) {}

  getKnexConfig(): Knex.Config {
    return {
      client: 'pg',
      connection: {
        host: this.configService.get<string>('POSTGRES_HOST', 'localhost'),
        user: this.configService.get<string>('POSTGRES_USER'),
        password: this.configService.get<string>('POSTGRES_PASSWORD'),
        database: this.configService.get<string>('POSTGRES_DB'),
        port: this.configService.get<number>('POSTGRES_PORT', 5432),
      },

      migrations: {
        directory: './migrations', // Caminho para o diretório de migrations
      },
      seeds: {
        directory: './seeds', // Caminho para o diretório de seeds, se houver
      },
    };
  }
}
