import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { RolRepository } from '../repositories/rol.repository';
import { RolUsuarioRepository } from '../repositories/rolUsuario.repository';
import { CreateUsuarioDto } from '../dto/usuarios/crearUsuario.dto';
import { EmailService } from '../services/email.service';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly rolRepository: RolRepository,
    private readonly rolUsuarioRepository: RolUsuarioRepository,
    private readonly emailService: EmailService,
  ) {}

  findAll() {
    return this.usuarioRepository.find({
      where: { activo: true },
      relations: ['roles', 'roles.rol'],
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id, activo: true },
      relations: ['roles', 'roles.rol'],
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async findByCorreo(correo: string) {
    return this.usuarioRepository.findOne({ where: { correo, activo: true } });
  }

  async findByToken(token: string) {
    return this.usuarioRepository.findOne({
      where: { verificacionToken: token },
    });
  }

  async verifyUsuario(usuario: Usuario) {
    usuario.verificado = true;
    usuario.verificacionToken = null;
    usuario.verificacionExpirada = null;
    await this.usuarioRepository.save(usuario);
  }

  async create(data: CreateUsuarioDto) {
    const { rolesIds, ...rest } = data;

    const usuario = this.usuarioRepository.create(rest);

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    usuario.verificacionToken = codigo;
    usuario.verificacionExpirada = new Date(Date.now() + 10 * 60 * 1000);
    usuario.verificado = false;

    await this.usuarioRepository.save(usuario);

    if (rolesIds && rolesIds.length > 0) {
      for (const rolId of rolesIds) {
        await this.asignarRol(usuario.id, rolId);
      }
    }

    await this.emailService.sendVerificationCode(usuario.correo, codigo);

    return this.findOne(usuario.id);
  }

  async update(id: number, data: any) {
    const usuario = await this.findOne(id);

    const { rolesAgregarIds, rolesQuitarIds, ...rest } = data;

    Object.assign(usuario, rest);
    await this.usuarioRepository.save(usuario);

    if (rolesAgregarIds && rolesAgregarIds.length > 0) {
      for (const rolId of rolesAgregarIds) {
        await this.asignarRol(usuario.id, rolId);
      }
    }

    if (rolesQuitarIds && rolesQuitarIds.length > 0) {
      for (const rolId of rolesQuitarIds) {
        await this.quitarRol(usuario.id, rolId);
      }
    }

    return this.findOne(usuario.id);
  }

  async partialUpdate(id: number, data: any) {
    return this.update(id, data);
  }

  async desactivar(id: number) {
    const usuario = await this.findOne(id);
    usuario.activo = false;
    return this.usuarioRepository.save(usuario);
  }

  async asignarRol(usuarioId: number, rolId: number) {
    const usuario = await this.findOne(usuarioId);

    const rol = await this.rolRepository.findOne({
      where: { id: rolId, activo: true },
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    const existe = await this.rolUsuarioRepository.findOne({
      where: { usuario: { id: usuarioId }, rol: { id: rolId }, activo: true },
    });

    if (existe)
      throw new BadRequestException('El usuario ya tiene este rol asignado');

    const rolUsuario = this.rolUsuarioRepository.create({
      usuario,
      rol,
      activo: true,
    });

    return this.rolUsuarioRepository.save(rolUsuario);
  }

  async quitarRol(usuarioId: number, rolId: number) {
    const registro = await this.rolUsuarioRepository.findOne({
      where: { usuario: { id: usuarioId }, rol: { id: rolId }, activo: true },
    });

    if (!registro)
      throw new NotFoundException('El rol no está asignado al usuario');

    registro.activo = false;
    return this.rolUsuarioRepository.save(registro);
  }
}
