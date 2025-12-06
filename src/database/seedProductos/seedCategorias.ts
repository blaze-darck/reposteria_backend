import { DataSource } from 'typeorm';
import { CategoriaProducto } from '../../productos/productosEntities/categoriaProducto.entity';

export async function categoriaSeed(dataSource: DataSource) {
  const repo = dataSource.getRepository(CategoriaProducto);

  // Categorías principales
  const categorias = [
    {
      nombre: 'Tortas y Pasteles',
      descripcion:
        'Postres elaborados a base de masas suaves, bizcochos o capas rellenas',
      activo: true,
    },
    {
      nombre: 'Cupcakes y Muffins',
      descripcion:
        'Porciones individuales elaboradas con masa de pastel, con o sin decoración',
      activo: true,
    },
    {
      nombre: 'Chocolateria',
      descripcion:
        'Productos elaborados con chocolate en distintas texturas y presentaciones',
      activo: true,
    },
    {
      nombre: 'Postres Helados',
      descripcion:
        'Postres congelados o semi-congelados con alta demanda en épocas cálidas',
      activo: true,
    },
  ];

  for (const cat of categorias) {
    const existe = await repo.findOne({ where: { nombre: cat.nombre } });
    if (!existe) {
      await repo.save(repo.create(cat));
    }
  }

  console.log('✔ Categorías creadas correctamente');
}
