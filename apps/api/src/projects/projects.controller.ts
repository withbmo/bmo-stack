import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { Project } from '@pytholit/contracts';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectsService } from './projects.service.js';

/**
 * Projects Controller
 * Handles project CRUD operations with ownership verification
 */
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: string,
    @Body() createProjectDto: CreateProjectDto
  ): Promise<Project> {
    return this.projectsService.create(userId, createProjectDto);
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string): Promise<Project[]> {
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string): Promise<Project> {
    return this.projectsService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    return this.projectsService.update(userId, id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string): Promise<void> {
    return this.projectsService.remove(userId, id);
  }
}
