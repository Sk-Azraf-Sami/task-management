import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class RegisterDto {
    @IsEmail()
    email: string; 

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    firstName?: string; 

    @IsString()
    @IsOptional()
    lastName?: string; 

    @IsEnum(Role)
    @IsOptional()
    role?: Role
}