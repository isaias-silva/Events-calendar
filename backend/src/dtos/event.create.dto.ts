import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class EventCreateDto {
    @IsNotEmpty()
    @MinLength(3)

    @ApiProperty()
    title: string

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(20)

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