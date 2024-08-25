import * as winston from 'winston';
import * as Elasticsearch from 'winston-elasticsearch';
import { ConfigService } from '@nestjs/config';

export function createLogger(configService: ConfigService) {
  const esTransportOpts = {
    level: 'info',
    clientOpts: {
      node: configService.get<string>('ELASTICSEARCH_URL'),
      auth: {
        username: configService.get<string>('ELASTICSEARCH_USERNAME'),
        password: configService.get<string>('ELASTICSEARCH_PASSWORD'),
      },
    },
    indexPrefix: 'svc-catalog-logs',
  };

  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new Elasticsearch.ElasticsearchTransport(esTransportOpts),
    ],
  });
}
