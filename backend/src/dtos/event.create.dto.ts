import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

export class EventCreateDto {
    @IsNotEmpty()
    title: string
    @IsNotEmpty()
    describ: string
   
    @IsNotEmpty()
    @IsDateString()
    initString: string

    @IsNotEmpty()    
    @IsDateString()
    endString: string
}