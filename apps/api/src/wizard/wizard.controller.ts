import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WizardGenerateDto } from './dto/wizard-generate.dto';
import { WizardService } from './wizard.service';
import type { WizardManifest, WizardSchema, WizardTemplateSummary } from './wizard.types';

@Controller('wizard')
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  @Get('templates')
  async listTemplates(): Promise<WizardTemplateSummary[]> {
    return this.wizardService.listTemplates();
  }

  @Get(':version/schema.json')
  async getSchema(@Param('version') version: string): Promise<WizardSchema> {
    return this.wizardService.getSchema(version);
  }

  @Get('templates/:templateId/:version/schema.json')
  async getSchemaForTemplate(
    @Param('templateId') templateId: string,
    @Param('version') version: string
  ): Promise<WizardSchema> {
    return this.wizardService.getSchemaForTemplate(templateId, version);
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
    @CurrentUser('id') userId: string,
    @Param('version') version: string,
    @Body() dto: WizardGenerateDto & Record<string, unknown>
  ): Promise<{ id: string; manifestId: string }> {
    const { projectId } = dto;
    // Support either nested `{ inputs }` or a flat body `{ ...inputs }`.
    const rawInputs = dto.inputs && typeof dto.inputs === 'object' ? dto.inputs : (dto as any);
    const { inputs: _inputs, projectId: _projectId, ...flatInputs } = rawInputs;

    return this.wizardService.generate(userId, version, projectId, flatInputs);
  }

  @Post('templates/:templateId/:version/generate')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    })
  )
  async generateForTemplate(
    @CurrentUser('id') userId: string,
    @Param('templateId') templateId: string,
    @Param('version') version: string,
    @Body() dto: WizardGenerateDto & Record<string, unknown>
  ): Promise<{ id: string; manifestId: string }> {
    const { projectId } = dto;
    const rawInputs = dto.inputs && typeof dto.inputs === 'object' ? dto.inputs : (dto as any);
    const { inputs: _inputs, projectId: _projectId, ...flatInputs } = rawInputs;

    return this.wizardService.generateForTemplate(
      userId,
      templateId,
      version,
      projectId,
      flatInputs
    );
  }

  @Get('manifests/:id')
  async getManifest(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<WizardManifest> {
    return this.wizardService.getManifest(userId, id);
  }
}
