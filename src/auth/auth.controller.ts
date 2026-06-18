import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginRequestDto } from "./dto/requests/login-request.dto";
import { RefreshTokenRequestDto } from "./dto/requests/refresh-token-request.dto";
import { RegisterRequestDto } from "./dto/requests/register-request.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterRequestDto) {
    const data = await this.authService.register(registerDto);
    return { data };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginRequestDto) {
    const data = await this.authService.login(loginDto);
    return { data };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenRequestDto) {
    const data = await this.authService.refresh(refreshTokenDto);
    return { data };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshTokenDto: RefreshTokenRequestDto) {
    await this.authService.logout(refreshTokenDto);
    return { data: null, message: "Logged out successfully" };
  }
}
