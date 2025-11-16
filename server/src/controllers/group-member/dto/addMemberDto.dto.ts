import { ApiProperty } from "@nestjs/swagger";

export class AddMemberDto {
  @ApiProperty({description: "User ID of person to add"})
  userId: string;
}