import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Producto } from './productosEntities/producto.entity';
import { CategoriaProducto } from './productosEntities/categoriaProducto.entity';
import { SubcategoriaProducto } from './productosEntities/subcategoriaProductos.entity';

import { ProductoController } from './productoControllers/productos.controller';
import { CategoriaProductoController } from './productoControllers/categoriaProductos.controller';
import { SubcategoriaProductoController } from './productoControllers/subcategoriaProductos.controller';

import { ProductoService } from './productoService/productos.service';
import { CategoriaProductoService } from './productoService/categoriaProducto.service';
import { SubcategoriaProductoService } from './productoService/subcategoriaProductos.service';

import { ProductoRepository } from './productoRepositories/producto.repository';
import { CategoriaProductoRepository } from './productoRepositories/categoriaProducto.repository';
import { SubcategoriaProductoRepository } from './productoRepositories/subcategoriasProductos.repository';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      CategoriaProducto,
      SubcategoriaProducto,
    ]),

    // Multer
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/productos',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],

  controllers: [
    ProductoController,
    CategoriaProductoController,
    SubcategoriaProductoController,
  ],

  providers: [
    ProductoService,
    CategoriaProductoService,
    SubcategoriaProductoService,
    ProductoRepository,
    CategoriaProductoRepository,
    SubcategoriaProductoRepository,
  ],

  exports: [
    ProductoRepository,
    CategoriaProductoRepository,
    SubcategoriaProductoRepository,
    ProductoService,
    CategoriaProductoService,
    SubcategoriaProductoService,
  ],
})
export class ProductosModule {}
