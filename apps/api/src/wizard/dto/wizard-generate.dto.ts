import { IsObject, IsOptional, IsString } from 'class-validator';

/**
 * Accepts either:
 * - { projectId, inputs: {...} }
 * - { projectId, ...dynamicInputs }
 *
 * We keep `inputs` optional so existing callers can send a flat object.
 */
export class WizardGenerateDto {
  @IsString()
  projectId!: string;

  @IsOptional()
  @IsObject()
  inputs?: Record<string, unknown>;
}

