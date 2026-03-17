import { Module } from '@nestjs/common';

import { WizardController } from './wizard.controller.js';
import { WizardService } from './wizard.service.js';

@Module({
  controllers: [WizardController],
  providers: [WizardService],
})
export class WizardModule {}
