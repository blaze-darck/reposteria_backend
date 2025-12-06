// src/pedidos/pedidosRepositories/pedido.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Pedido, EstadoPedido } from '../pedidosEntities/pedidos.entity';

@Injectable()
export class PedidosRepository extends Repository<Pedido> {
  constructor(private dataSource: DataSource) {
    super(Pedido, dataSource.createEntityManager());
  }

  async buscarConFiltros(
    estado?: EstadoPedido,
    usuarioId?: number,
    fechaInicio?: Date,
    fechaFin?: Date,
    pagina: number = 1,
    limite: number = 10,
  ) {
    const query = this.createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto');

    if (estado) {
      query.andWhere('pedido.estado = :estado', { estado });
    }

    if (usuarioId) {
      query.andWhere('pedido.usuario_id = :usuarioId', { usuarioId });
    }

    if (fechaInicio && fechaFin) {
      query.andWhere('pedido.fecha_pedido BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      });
    }

    const [pedidos, total] = await query
      .orderBy('pedido.id', 'DESC') // ✅ CAMBIO: usar 'id' en lugar de 'fecha_pedido'
      .skip((pagina - 1) * limite)
      .take(limite)
      .getManyAndCount();

    return {
      datos: pedidos,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async buscarPorNumeroPedido(numeroPedido: string): Promise<Pedido | null> {
    return this.findOne({
      where: { numeroPedido },
      relations: ['cliente', 'detalles', 'detalles.producto'],
    });
  }

  async obtenerUltimoPedido(): Promise<Pedido | null> {
    return this.createQueryBuilder('pedido')
      .orderBy('pedido.id', 'DESC')
      .getOne();
  }

  async contarPorEstado(estado: EstadoPedido): Promise<number> {
    return this.count({ where: { estado } });
  }

  async obtenerTotalVentas(): Promise<number> {
    const resultado = await this.createQueryBuilder('pedido')
      .select('SUM(pedido.total)', 'total')
      .where('pedido.estado = :estado', { estado: EstadoPedido.COMPLETADO })
      .getRawOne();

    return parseFloat(resultado?.total || 0);
  }

  async buscarPorUsuario(usuarioId: number): Promise<Pedido[]> {
    return this.find({
      where: { cliente: { id: usuarioId } },
      relations: ['detalles', 'detalles.producto'],
      order: { id: 'DESC' }, // ✅ CAMBIO: usar 'id' para consistencia
    });
  }
}
