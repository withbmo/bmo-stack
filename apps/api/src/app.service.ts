import { Injectable } from '@nestjs/common';
import { APP_CONFIG } from '@pytholit/config';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: APP_CONFIG.name,
      version: APP_CONFIG.version,
      description: APP_CONFIG.description,
      message: 'Welcome to Pytholit API v2 - Nest.js + Next.js Architecture',
    };
  }
}
