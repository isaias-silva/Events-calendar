import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, isNotEmpty } from "class-validator";

export class EventCreateDto {
    @IsNotEmpty()
    @ApiProperty()
    title: string

    @IsNotEmpty()
    @ApiProperty()

    describ: string

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()

    initString: string

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()

    endString: string

    @ApiProperty()
    @IsOptional()
    isPrivate: boolean

}