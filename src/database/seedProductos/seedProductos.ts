import { DataSource } from 'typeorm';
import { Producto } from '../../productos/productosEntities/producto.entity';
import { SubcategoriaProducto } from '../../productos/productosEntities/subcategoriaProductos.entity';

export async function productoSeed(dataSource: DataSource) {
  const productoRepo = dataSource.getRepository(Producto);
  const subcategoriaRepo = dataSource.getRepository(SubcategoriaProducto);

  const pastelesClasicos = await subcategoriaRepo.findOne({
    where: { nombre: 'Pasteles Clasicos' },
  });
  const cheesecakes = await subcategoriaRepo.findOne({
    where: { nombre: 'Cheesecakes' },
  });
  const pastelesPersonalizados = await subcategoriaRepo.findOne({
    where: { nombre: 'Pasteles Personalizados' },
  });

  const cupcakesDecorados = await subcategoriaRepo.findOne({
    where: { nombre: 'Cupcakes Decorados' },
  });
  const cupcakesRellenos = await subcategoriaRepo.findOne({
    where: { nombre: 'Cupcakes Rellenos' },
  });
  const miniCupcakes = await subcategoriaRepo.findOne({
    where: { nombre: 'Mini Cupcakes' },
  });

  const bombones = await subcategoriaRepo.findOne({
    where: { nombre: 'Bombones' },
  });
  const chocolatesArtesanales = await subcategoriaRepo.findOne({
    where: { nombre: 'Chocolates Artesanales' },
  });
  const chocolatesRellenos = await subcategoriaRepo.findOne({
    where: { nombre: 'Chocolates Rellenos' },
  });

  const heladosArtesanales = await subcategoriaRepo.findOne({
    where: { nombre: 'Helados Artesanales' },
  });
  const paletasHeladas = await subcategoriaRepo.findOne({
    where: { nombre: 'Paletas Heladas' },
  });
  const postresEnVaso = await subcategoriaRepo.findOne({
    where: { nombre: 'Postres en Vaso Helados' },
  });
  const subs = {
    pastelesClasicos,
    cheesecakes,
    pastelesPersonalizados,
    cupcakesDecorados,
    cupcakesRellenos,
    miniCupcakes,
    bombones,
    chocolatesArtesanales,
    chocolatesRellenos,
    heladosArtesanales,
    paletasHeladas,
    postresEnVaso,
  };

  for (const [nombre, valor] of Object.entries(subs)) {
    if (!valor) {
      console.log(`Falta la subcategoría: ${nombre}`);
    }
  }

  if (Object.values(subs).some((s) => !s)) {
    console.log(' No se pueden crear productos: faltan subcategorías.');
    return;
  }

  const productos = [
    {
      nombre: 'Pastel de Chocolate Clasico',
      descripcion:
        'Pastel esponjoso de chocolate con cobertura suave y cremosa. Ideal para celebraciones.',
      precio: 35,
      disponibilidad: 20,
      subcategoria: pastelesClasicos!,
      activo: true,
      imagen: '/uploads/productos/torta.jfif',
    },

    {
      nombre: 'Cupcake de Vainilla con Topping',
      descripcion:
        'Cupcake suave de vainilla decorado con crema de mantequilla y chispas dulces.',
      precio: 5,
      disponibilidad: 40,
      subcategoria: cupcakesDecorados!,
      activo: true,
      imagen: '/uploads/productos/cupcakes.jfif',
    },

    {
      nombre: 'Caja de Bombones Artesanales',
      descripcion:
        'Selección de bombones rellenos de chocolate y avellana preparados artesanalmente.',
      precio: 18,
      disponibilidad: 30,
      subcategoria: chocolatesArtesanales!,
      activo: true,
      imagen: '/uploads/productos/chocolate.jfif',
    },

    {
      nombre: 'Helado Artesanal de Frutos Rojos',
      descripcion:
        'Helado artesanal preparado con frutos rojos naturales. Cremoso y refrescante.',
      precio: 7,
      disponibilidad: 25,
      subcategoria: heladosArtesanales!,
      activo: true,
      imagen: '/uploads/productos/helado.jfif',
    },
  ];

  for (const prod of productos) {
    const existe = await productoRepo.findOne({
      where: { nombre: prod.nombre },
    });

    if (!existe) {
      await productoRepo.save(productoRepo.create(prod));
    }
  }

  console.log('✔ Productos creados correctamente');
}
