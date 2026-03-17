import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { Project } from '@pytholit/contracts';
import slugify from '@sindresorhus/slugify';

import { PrismaService } from '../database/prisma.service.js';
import type { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

/**
 * Projects Service
 * Handles project CRUD operations with Prisma
 */
@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    createProjectDto: CreateProjectDto
  ): Promise<Project> {
    // Generate slug from name if not provided
    const slug = createProjectDto.slug || slugify(createProjectDto.name);

    // Check if slug already exists for this user
    const existingProject = await this.prisma.client.project.findUnique({
      where: {
        ownerId_slug: {
          ownerId: userId,
          slug,
        },
      },
    });

    if (existingProject) {
      throw new ConflictException(
        `Project with slug "${slug}" already exists for this user`
      );
    }

    const project = await this.prisma.client.project.create({
      data: {
        ownerId: userId,
        name: createProjectDto.name,
        slug,
        repoExportEnabled: createProjectDto.repoExportEnabled || false,
      },
    });

    return {
      id: project.id,
      ownerId: project.ownerId,
      name: project.name,
      slug: project.slug,
      repoExportEnabled: project.repoExportEnabled,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  async findAll(userId: string): Promise<Project[]> {
    const projects = await this.prisma.client.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => ({
      id: project.id,
      ownerId: project.ownerId,
      name: project.name,
      slug: project.slug,
      repoExportEnabled: project.repoExportEnabled,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));
  }

  async findOne(userId: string, projectId: string): Promise<Project> {
    const project = await this.prisma.client.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Verify ownership
    if (project.ownerId !== userId) {
      throw new ForbiddenException('Access denied to this project');
    }

    return {
      id: project.id,
      ownerId: project.ownerId,
      name: project.name,
      slug: project.slug,
      repoExportEnabled: project.repoExportEnabled,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  async update(
    userId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    // Verify ownership first
    await this.findOne(userId, projectId);

    // If updating slug, check for conflicts
    if (updateProjectDto.slug) {
      const existingProject = await this.prisma.client.project.findFirst({
        where: {
          ownerId: userId,
          slug: updateProjectDto.slug,
          NOT: { id: projectId },
        },
      });

      if (existingProject) {
        throw new ConflictException(
          `Project with slug "${updateProjectDto.slug}" already exists for this user`
        );
      }
    }

    const updatedProject = await this.prisma.client.project.update({
      where: { id: projectId },
      data: updateProjectDto,
    });

    return {
      id: updatedProject.id,
      ownerId: updatedProject.ownerId,
      name: updatedProject.name,
      slug: updatedProject.slug,
      repoExportEnabled: updatedProject.repoExportEnabled,
      createdAt: updatedProject.createdAt.toISOString(),
      updatedAt: updatedProject.updatedAt.toISOString(),
    };
  }

  async remove(userId: string, projectId: string): Promise<void> {
    // Verify ownership first
    await this.findOne(userId, projectId);

    await this.prisma.client.project.delete({
      where: { id: projectId },
    });
  }
}
