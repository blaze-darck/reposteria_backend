import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosController } from '../pedidos/pedidosControllers/pedidos.controller';
import { PedidosService } from '../pedidos/pedidosServices/pedidos.service';
import { PedidosRepository } from '../pedidos/pedidosRepositories/pedido.repository';
import { Pedido } from '../pedidos/pedidosEntities/pedidos.entity';
import { DetallePedido } from '../pedidos/pedidosEntities/detallePedido.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Producto } from '../productos/productosEntities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, DetallePedido, Usuario, Producto]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService, PedidosRepository],
  exports: [PedidosService],
})
export class PedidosModule {}
