import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/usuarios/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const usuario = await this.authService.validateUser(
      loginDto.correo,
      loginDto.contrasena,
    );

    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    return this.authService.login(usuario);
  }
}
