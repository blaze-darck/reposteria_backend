import { DataSource } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../usuarios/entities/rol.entity';
import { RolUsuario } from '../../usuarios/entities/rolUsuario.entity';

export async function seedRolUsuario(dataSource: DataSource) {
  const rolUsuarioRepo = dataSource.getRepository(RolUsuario);
  const usuarioRepo = dataSource.getRepository(Usuario);
  const rolRepo = dataSource.getRepository(Rol);

  const usuario = await usuarioRepo.findOneBy({
    correo: 'paredesgabriel784@gmail.com',
  });

  if (!usuario) {
    console.log('Usuario no encontrado, no se puede asignar rol.');
    return;
  }

  const rol = await rolRepo.findOneBy({ nombre: 'Administrador' });
  if (!rol) {
    console.log('Rol no encontrado en la base de datos.');
    return;
  }

  const relacionExistente = await rolUsuarioRepo.findOne({
    where: { usuario: { id: usuario.id }, rol: { id: rol.id } },
  });

  if (relacionExistente) {
    console.log('El usuario ya tiene el rol asignado, saltando seed.');
    return;
  }

  const rolUsuario = rolUsuarioRepo.create({ usuario, rol });
  await rolUsuarioRepo.save(rolUsuario);
  console.log(
    `Rol "${rol.nombre}" asignado al usuario "${usuario.nombre}" exitosamente!`,
  );
}
