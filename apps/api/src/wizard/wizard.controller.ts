import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WizardGenerateDto } from './dto/wizard-generate.dto';
import { WizardService } from './wizard.service';
import type { WizardManifest, WizardSchema } from './wizard.types';

@Controller('wizard')
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  @Get(':version/schema.json')
  async getSchema(@Param('version') version: string): Promise<WizardSchema> {
    return this.wizardService.getSchema(version);
  }

  @Post(':version/generate')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: false, // keep dynamic wizard input keys
      forbidNonWhitelisted: false,
    })
  )
  async generate(
    @CurrentUser() user: any,
    @Param('version') version: string,
    @Body() dto: WizardGenerateDto & Record<string, unknown>
  ): Promise<{ id: string; manifestId: string }> {
    const { projectId } = dto;
    // Support either nested `{ inputs }` or a flat body `{ ...inputs }`.
    const rawInputs =
      dto.inputs && typeof dto.inputs === 'object' ? dto.inputs : (dto as any);
    const { inputs: _inputs, projectId: _projectId, ...flatInputs } = rawInputs;

    return this.wizardService.generate(user.id, version, projectId, flatInputs);
  }

  @Get('manifests/:id')
  async getManifest(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<WizardManifest> {
    return this.wizardService.getManifest(user.id, id);
  }
}

