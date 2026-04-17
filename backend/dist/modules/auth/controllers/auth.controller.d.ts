import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<import("../entities/user.entity").User>;
    updateProfile(req: any, updateDto: any): Promise<{
        message: string;
    }>;
}
