import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class EventUpdateDto {
    @IsOptional()
    @ApiProperty()
    title: string


    @IsOptional()
    @ApiProperty()
    describ: string


    @IsOptional()
    @IsDateString()
    @ApiProperty()

    initString: string

    @IsOptional()
    @IsDateString()
    @ApiProperty()

    endString: string


    @ApiProperty()
    @IsOptional()
    isPrivate: boolean
}