import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { CreateProjectRequestDto } from './dtos/create-project-request.dto';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { GetProjects } from './usecases/get-projects/get-projects.usecase';
import { CreateProject } from './usecases/create-project/create-project.usecase';
import { CreateProjectCommand } from './usecases/create-project/create-project.command';
import { UpdateProjectRequestDto } from './dtos/update-project-request.dto';
import { UpdateProject } from './usecases/update-project/update-project.usecase';
import { UpdateProjectCommand } from './usecases/update-project/update-project.command';
import { DeleteProject } from './usecases/delete-project/delete-project.usecase';
import { DocumentNotFoundException } from '../shared/exceptions/document-not-found.exception';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { APIKeyGuard } from '../shared/framework/auth.gaurd';

@Controller('/project')
@ApiTags('Project')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class ProjectController {
  constructor(
    private getProjectsUsecase: GetProjects,
    private createProjectUsecase: CreateProject,
    private updateProjectUsecase: UpdateProject,
    private deleteProjectUsecase: DeleteProject
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get projects',
  })
  @ApiOkResponse({
    type: [ProjectResponseDto],
  })
  getProjects(): Promise<ProjectResponseDto[]> {
    return this.getProjectsUsecase.execute();
  }

  @Post('')
  @ApiOperation({
    summary: 'Create project',
  })
  @ApiOkResponse({
    type: ProjectResponseDto,
  })
  createProject(@Body() body: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    return this.createProjectUsecase.execute(
      CreateProjectCommand.create({
        code: body.code,
        name: body.name,
        authHeaderName: body.authHeaderName,
      })
    );
  }

  @Put(':projectId')
  @ApiOperation({
    summary: 'Update project',
  })
  @ApiOkResponse({
    type: ProjectResponseDto,
  })
  async updateProject(
    @Body() body: UpdateProjectRequestDto,
    @Param('projectId', ValidateMongoId) projectId: string
  ): Promise<ProjectResponseDto> {
    const document = await this.updateProjectUsecase.execute(
      UpdateProjectCommand.create({ name: body.name, authHeaderName: body.authHeaderName }),
      projectId
    );
    if (!document) {
      throw new DocumentNotFoundException('Project', projectId);
    }

    return document;
  }

  @Delete(':projectId')
  @ApiOperation({
    summary: 'Delete project',
  })
  @ApiOkResponse({
    type: ProjectResponseDto,
  })
  async deleteProject(@Param('projectId', ValidateMongoId) projectId: string): Promise<ProjectResponseDto> {
    const document = await this.deleteProjectUsecase.execute(projectId);
    if (!document) {
      throw new DocumentNotFoundException('Project', projectId);
    }

    return document;
  }
}
