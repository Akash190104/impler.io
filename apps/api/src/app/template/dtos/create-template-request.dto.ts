import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { changeToCode } from '@impler/shared';
import { IsDefined, IsString, Validate, IsNumber, IsUrl } from 'class-validator';
import { UniqueValidator } from '../../shared/framework/is-unique.validator';

export class CreateTemplateRequestDto {
  @ApiProperty({
    description: 'Name of the template',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Code of the template',
  })
  @IsString()
  @IsDefined()
  @Validate(UniqueValidator, ['Template', 'code'], {
    message: 'Code is already taken',
  })
  @Transform((value) => changeToCode(value.value))
  code: string;

  @ApiProperty({
    description: 'Callback URL of the template, gets called when sending data to the application',
  })
  @IsUrl()
  @IsDefined()
  callbackUrl: string;

  @ApiProperty({
    description: 'Size of data in rows that gets sent to the application',
  })
  @IsNumber()
  @IsDefined()
  chunkSize: number;
}
