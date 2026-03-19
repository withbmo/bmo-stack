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

  private buildStateWhere(state: 'active' | 'archived' | 'all') {
    if (state === 'active') {
      return { archivedAt: null } as const;
    }

    if (state === 'archived') {
      return { archivedAt: { not: null } } as const;
    }

    return {};
  }

  private toContractProject(project: {
    id: string;
    ownerId: string;
    name: string;
    slug: string;
    repoExportEnabled: boolean;
    archivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Project {
    return {
      id: project.id,
      ownerId: project.ownerId,
      name: project.name,
      slug: project.slug,
      repoExportEnabled: project.repoExportEnabled,
      lifecycleState: project.archivedAt ? 'archived' : 'active',
      archivedAt: project.archivedAt?.toISOString() ?? null,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

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

    return this.toContractProject(project);
  }

  async findAll(userId: string, state: 'active' | 'archived' | 'all' = 'active'): Promise<Project[]> {
    const projects = await this.prisma.client.project.findMany({
      where: {
        ownerId: userId,
        ...this.buildStateWhere(state),
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => this.toContractProject(project));
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

    return this.toContractProject(project);
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

    return this.toContractProject(updatedProject);
  }

  async archive(userId: string, projectId: string): Promise<Project> {
    await this.findOne(userId, projectId);

    const project = await this.prisma.client.project.update({
      where: { id: projectId },
      data: {
        archivedAt: new Date(),
      },
    });

    return this.toContractProject(project);
  }

  async restore(userId: string, projectId: string): Promise<Project> {
    await this.findOne(userId, projectId);

    const project = await this.prisma.client.project.update({
      where: { id: projectId },
      data: {
        archivedAt: null,
      },
    });

    return this.toContractProject(project);
  }

  async remove(userId: string, projectId: string): Promise<void> {
    // Verify ownership first
    await this.findOne(userId, projectId);

    await this.prisma.client.project.delete({
      where: { id: projectId },
    });
  }
}
