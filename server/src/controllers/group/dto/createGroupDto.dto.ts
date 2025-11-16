import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({description: "Name of the Group/Hive"})
  @IsString()
  @IsNotEmpty()
  name: string;
}