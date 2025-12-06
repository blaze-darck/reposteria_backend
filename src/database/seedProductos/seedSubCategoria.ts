import { DataSource } from 'typeorm';
import { CategoriaProducto } from '../../productos/productosEntities/categoriaProducto.entity';
import { SubcategoriaProducto } from '../../productos/productosEntities/subcategoriaProductos.entity';

export async function subcategoriaSeed(dataSource: DataSource) {
  const categoriaRepo = dataSource.getRepository(CategoriaProducto);
  const subcategoriaRepo = dataSource.getRepository(SubcategoriaProducto);

  const torta = await categoriaRepo.findOne({
    where: { nombre: 'Tortas y Pasteles' },
  });
  const cupcakes = await categoriaRepo.findOne({
    where: { nombre: 'Cupcakes y Muffins' },
  });
  const chocolate = await categoriaRepo.findOne({
    where: { nombre: 'Chocolateria' },
  });
  const helado = await categoriaRepo.findOne({
    where: { nombre: 'Postres Helados' },
  });

  if (!torta || !cupcakes || !chocolate || !helado) {
    console.log('Las categorías principales no están creadas.');
    return;
  }

  const subcategorias = [
    {
      nombre: 'Pasteles Clasicos',
      descripcion: 'Tortas tradicionales con recetas populares',
      categoria: torta,
    },
    {
      nombre: 'Cheesecakes',
      descripcion: 'Base de galleta con crema de queso',
      categoria: torta,
    },
    {
      nombre: 'Pasteles Personalizados',
      descripcion: 'Tortas diseñadas a gusto del cliente',
      categoria: torta,
    },

    {
      nombre: 'Cupcakes Decorados',
      descripcion: 'Con frosting, fondant o toppers',
      categoria: cupcakes,
    },
    {
      nombre: 'Cupcakes Rellenos',
      descripcion: 'Relleno de crema, dulce de leche, mermelada o mousse',
      categoria: cupcakes,
    },
    {
      nombre: 'Mini Cupcakes',
      descripcion: 'Cupcakes de tamaño pequeño para eventos',
      categoria: cupcakes,
    },

    {
      nombre: 'Bombones',
      descripcion: 'Pequeñas piezas rellenas',
      categoria: chocolate,
    },
    {
      nombre: 'Chocolates Artesanales',
      descripcion: 'Barras hechas a mano, con ingredientes naturales',
      categoria: chocolate,
    },
    {
      nombre: 'Chocolates Rellenos',
      descripcion: 'Barras o piezas con centro cremoso',
      categoria: chocolate,
    },

    {
      nombre: 'Helados Artesanales',
      descripcion: 'Helados hechos a mano, sin químicos industriales',
      categoria: helado,
    },
    {
      nombre: 'Paletas Heladas',
      descripcion: 'Paletas de crema o agua',
      categoria: helado,
    },
    {
      nombre: 'Postres en Vaso Helados',
      descripcion: 'Capas congeladas servidas en vaso',
      categoria: helado,
    },
  ];

  for (const sub of subcategorias) {
    const existe = await subcategoriaRepo.findOne({
      where: { nombre: sub.nombre },
    });

    if (!existe) {
      await subcategoriaRepo.save(
        subcategoriaRepo.create({
          nombre: sub.nombre,
          descripcion: sub.descripcion,
          categoria: sub.categoria,
          activo: true,
        }),
      );
    }
  }
}
