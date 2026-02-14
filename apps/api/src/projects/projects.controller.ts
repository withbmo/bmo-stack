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
import { CreateProjectDto } from '@pytholit/validation/class-validator';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

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
    @CurrentUser() user: any,
    @Body() createProjectDto: CreateProjectDto
  ): Promise<Project> {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get()
  async findAll(@CurrentUser() user: any): Promise<Project[]> {
    return this.projectsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<Project> {
    return this.projectsService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    return this.projectsService.update(user.id, id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser() user: any, @Param('id') id: string): Promise<void> {
    return this.projectsService.remove(user.id, id);
  }
}
