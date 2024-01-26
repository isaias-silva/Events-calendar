import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, isNotEmpty } from "class-validator";

export class EventResponseApproveDto {

    @IsNotEmpty()
    @ApiProperty()

    _id: string

    @IsNotEmpty()
    @ApiProperty()

    accept: boolean


}