import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Responses } from "src/enums/Responses";

export class UserLoginDto{
   
    @IsEmail()
    @IsNotEmpty({message:Responses.USER_MAIL_IS_REQUIRED})
    @ApiProperty()
    mail: string;

    @IsNotEmpty({message:Responses.USER_PASSWORD_IS_REQUIRED})
    @ApiProperty()
    password: string;
}