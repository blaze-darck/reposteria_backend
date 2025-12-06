import { DataSource } from 'typeorm';
import { Rol } from '../../usuarios/entities/rol.entity';

export async function seedRoles(dataSource: DataSource) {
  const rolRepo = dataSource.getRepository(Rol);

  const roles = [
    { nombre: 'Administrador', descripcion: 'Administrador del sistema' },
    { nombre: 'Usuario', descripcion: 'Usuario normal' },
    { nombre: 'Cocinero', descripcion: 'Encargado de la cocina' },
    { nombre: 'Mesero', descripcion: 'Encargado de los pedidos'},
    { nombre: 'Cajero', descripcion: 'Encargado de las compras'}
  ];

  for (const rolData of roles) {
    const rolExistente = await rolRepo.findOneBy({ nombre: rolData.nombre });
    if (rolExistente) {
      console.log(`Rol "${rolData.nombre}" ya existe, saltando seed.`);
      continue;
    }

    const rol = rolRepo.create(rolData);
    await rolRepo.save(rol);
    console.log(`Rol "${rol.nombre}" seed creado exitosamente!`);
  }
}
