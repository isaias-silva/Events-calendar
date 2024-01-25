import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, isNotEmpty } from "class-validator";

export class EventApproveDto {

    @IsNotEmpty()
    @ApiProperty()

    _id: string

    @IsNotEmpty()
    @ApiProperty()

    user: string


}