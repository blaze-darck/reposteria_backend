import { DataSource } from 'typeorm';
import { seedUsuarios } from './seedUsuarios/seedUsuario';
import { seedRoles } from './seedUsuarios/seedRol';
import { seedRolUsuario } from './seedUsuarios/seedRolUsuario';

import { categoriaSeed } from './seedProductos/seedCategorias';
import { productoSeed } from './seedProductos/seedProductos';
import { subcategoriaSeed } from './seedProductos/seedSubCategoria'
export async function runSeeds(dataSource: DataSource) {
  console.log('Ejecutando seeds...');

  await seedRoles(dataSource);
  await seedUsuarios(dataSource);
  await seedRolUsuario(dataSource);

  await categoriaSeed(dataSource);
  
  await subcategoriaSeed(dataSource);
  await productoSeed(dataSource);
  console.log('Todas las seeds ejecutadas!');
}
