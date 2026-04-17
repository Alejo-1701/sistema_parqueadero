import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<User>;
    updateProfile(userId: string, updateDto: any): Promise<{
        message: string;
    }>;
}
