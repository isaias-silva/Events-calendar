import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";


export class UserUpdateDto {

    @IsEmail()
    @IsOptional()
    @ApiProperty()
    mail: string;

    @ApiProperty()
    @IsOptional()
   
    name: string;
}