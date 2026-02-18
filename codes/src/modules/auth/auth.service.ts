import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService
    ){}
    async register(registerDto: RegisterDto){
        const existingUser = await this.prisma.user.findUnique({
            where:{email: registerDto.email}
        })
        if(existingUser){
            throw new ConflictException('User already exist')
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const emailVerificationToken = randomBytes(32).toString('hex');

        const newUser = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                firstName: registerDto.firstName, 
                lastName: registerDto.lastName, 
                role: registerDto.role || Role.MEMBER,
                emailVerificationToken
            }
        })

        return {
            message: 'User registered successfully',
            userId: newUser.id
        }
    }
}
