import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";


export class UserUpdateDto {

    @ApiProperty()
    @IsOptional()
   
    name: string;
}