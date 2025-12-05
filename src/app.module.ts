import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../ormconfig';
import { ConfigModule } from '@nestjs/config';

import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { AuthModule } from './usuarios/auth.module';
import { AsistenteModule } from './recomendacionPlatillos/moduloPlatillos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),

    UsuariosModule,
    AuthModule,
    ProductosModule,
    PedidosModule,
    AsistenteModule,
  ],
})
export class AppModule {}
