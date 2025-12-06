import { DataSource } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export async function seedUsuarios(dataSource: DataSource) {
  const usuarioRepo = dataSource.getRepository(Usuario);

  const usuarioExistente = await usuarioRepo.findOneBy({
    correo: 'admin@example.com',
  });

  if (usuarioExistente) {
    console.log('Usuario ya existe, saltando seed.');
    return;
  }

  const usuario = usuarioRepo.create({
    nombre: 'Gabriel',
    apellidoPaterno: 'Paredes',
    apellidoMaterno: 'Gutierrez',
    correo: 'paredesgabriel784@gmail.com',
    contrasena: 'dilegabo',
    ci: '9209113',
    telefono: '77771981',
    verificado: true,
  });

  await usuarioRepo.save(usuario);

  console.log('Usuario seed creado exitosamente!');
}
