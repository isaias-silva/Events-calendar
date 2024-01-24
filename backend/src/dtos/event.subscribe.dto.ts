import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, isNotEmpty } from "class-validator";

export class EventSubscribeDto {
 
    @IsNotEmpty()
    @ApiProperty()

    _id: string


}