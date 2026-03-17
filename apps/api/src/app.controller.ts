import { Controller, Get } from '@nestjs/common';

import { Public } from './auth/decorators/public.decorator.js';
import { APP_CONFIG } from './config/app.js';

@Controller()
export class AppController {
  @Public()
  @Get()
  getInfo() {
    return {
      name: APP_CONFIG.name,
      version: APP_CONFIG.version,
      description: APP_CONFIG.description,
      message: 'Welcome to Pytholit API v2 - Nest.js + Next.js Architecture',
    };
  }

  @Public()
  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
