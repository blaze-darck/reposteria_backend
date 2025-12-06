import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from '../usuarios/services/auth.service';
import { AuthController } from '../usuarios/controllers/auth.controller';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { RolUsuario } from '../usuarios/entities/rolUsuario.entity';
import { Rol } from '../usuarios/entities/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, RolUsuario, Rol]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'JWT_SECRETO',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
