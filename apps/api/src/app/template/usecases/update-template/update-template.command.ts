import { IsString, IsNumber, IsOptional, IsNotEmpty, IsMongoId, Min } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class UpdateTemplateCommand extends BaseCommand {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  callbackUrl?: string;

  @IsNumber({
    allowNaN: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Min(1)
  chunkSize?: number;

  @IsMongoId({
    message: '_projectId is not valid',
  })
  @IsOptional()
  _projectId?: string;
}
