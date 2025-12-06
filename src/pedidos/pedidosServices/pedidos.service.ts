// src/pedidos/pedidosServices/pedidos.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Between } from 'typeorm';
import { PedidosRepository } from '../pedidosRepositories/pedido.repository';
import { Pedido, EstadoPedido } from '../pedidosEntities/pedidos.entity';
import { DetallePedido } from '../pedidosEntities/detallePedido.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Producto } from '../../productos/productosEntities/producto.entity';
import { CrearPedidoDto } from '../dto/createPedido.dto';
import { ActualizarPedidoDto } from '../dto/actualizarPedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    private readonly pedidosRepository: PedidosRepository,
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
    @InjectRepository(DetallePedido)
    private readonly detallesRepository: Repository<DetallePedido>,
    private readonly dataSource: DataSource,
  ) {}

  async crear(dto: CrearPedidoDto): Promise<Pedido> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('=== INICIO CREACIÓN PEDIDO ===');
      console.log('DTO recibido:', JSON.stringify(dto, null, 2));

      console.log('1. Buscando usuario ID:', dto.usuarioId);
      const usuario = await this.usuariosRepository.findOne({
        where: { id: dto.usuarioId },
      });

      if (!usuario) {
        throw new NotFoundException(
          `Usuario con ID ${dto.usuarioId} no encontrado`,
        );
      }
      console.log('✓ Usuario encontrado:', usuario.id, usuario.nombre);

      let subtotal = 0;
      const detalles: DetallePedido[] = [];

      console.log('2. Procesando', dto.detalles.length, 'detalles');
      for (const detalleDto of dto.detalles) {
        console.log('  - Buscando producto ID:', detalleDto.productoId);
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: detalleDto.productoId },
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto con ID ${detalleDto.productoId} no encontrado`,
          );
        }
        console.log(
          '  ✓ Producto encontrado:',
          producto.id,
          producto.nombre,
          'Precio:',
          producto.precio,
          'Stock actual:',
          producto.disponibilidad,
        );

        // Validar stock disponible
        if (producto.disponibilidad < detalleDto.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.disponibilidad}, Solicitado: ${detalleDto.cantidad}`,
          );
        }

        // Reducir stock del producto
        producto.disponibilidad -= detalleDto.cantidad;
        await queryRunner.manager.save(Producto, producto);
        console.log(
          '  ✓ Stock reducido. Nuevo stock:',
          producto.disponibilidad,
        );

        const detalle = new DetallePedido();
        detalle.producto = producto;
        detalle.cantidad = detalleDto.cantidad;
        detalle.precioUnitario = Number(producto.precio);
        detalle.subtotal = Number(producto.precio) * detalleDto.cantidad;

        console.log(
          '  ✓ Detalle creado - Cantidad:',
          detalle.cantidad,
          'Subtotal:',
          detalle.subtotal,
        );

        subtotal += detalle.subtotal;
        detalles.push(detalle);
      }
      console.log('✓ Subtotal total:', subtotal);

      console.log('3. Generando número de pedido...');
      const numeroPedido = await this.generarNumeroPedido();
      console.log('✓ Número generado:', numeroPedido);

      console.log('4. Creando objeto Pedido...');
      const pedido = new Pedido();
      pedido.numeroPedido = numeroPedido;
      pedido.cliente = usuario;
      pedido.metodoPago = dto.metodoPago;
      pedido.tipoEntrega = dto.tipoEntrega;
      pedido.notas = dto.notas ?? null;
      pedido.estado = EstadoPedido.PENDIENTE;
      pedido.subtotal = subtotal;
      pedido.total = subtotal;
      pedido.detalles = detalles;

      console.log('✓ Objeto pedido creado:', {
        numeroPedido: pedido.numeroPedido,
        clienteId: pedido.cliente.id,
        metodoPago: pedido.metodoPago,
        tipoEntrega: pedido.tipoEntrega,
        estado: pedido.estado,
        subtotal: pedido.subtotal,
        total: pedido.total,
        detallesCount: pedido.detalles.length,
      });

      console.log('5. Guardando en base de datos...');
      const pedidoGuardado = await queryRunner.manager.save(Pedido, pedido);
      console.log('✓ Pedido guardado con ID:', pedidoGuardado.id);

      console.log('6. Haciendo commit...');
      await queryRunner.commitTransaction();
      console.log('✓ Commit exitoso');

      console.log('7. Buscando pedido completo...');
      const pedidoCompleto = await this.buscarPorId(pedidoGuardado.id);
      console.log('✓ Pedido completo recuperado');
      console.log('=== FIN CREACIÓN PEDIDO ===');

      return pedidoCompleto;
    } catch (error) {
      console.error('❌ ERROR EN CREACIÓN DE PEDIDO:');
      console.error('Tipo de error:', error.constructor.name);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);

      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Error al crear el pedido');
    } finally {
      await queryRunner.release();
    }
  }

  async buscarTodos(
    estado?: EstadoPedido,
    usuarioId?: number,
    fechaInicio?: Date,
    fechaFin?: Date,
    pagina: number = 1,
    limite: number = 10,
  ) {
    return this.pedidosRepository.buscarConFiltros(
      estado,
      usuarioId,
      fechaInicio,
      fechaFin,
      pagina,
      limite,
    );
  }

  async buscarPorId(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: ['cliente', 'detalles', 'detalles.producto'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  async buscarPorNumeroPedido(numeroPedido: string): Promise<Pedido> {
    const pedido =
      await this.pedidosRepository.buscarPorNumeroPedido(numeroPedido);

    if (!pedido) {
      throw new NotFoundException(`Pedido ${numeroPedido} no encontrado`);
    }

    return pedido;
  }

  async buscarPorUsuario(usuarioId: number): Promise<Pedido[]> {
    return this.pedidosRepository.buscarPorUsuario(usuarioId);
  }

  async actualizar(id: number, dto: ActualizarPedidoDto): Promise<Pedido> {
    const pedido = await this.buscarPorId(id);

    if (dto.estado) {
      if (
        pedido.estado === EstadoPedido.COMPLETADO ||
        pedido.estado === EstadoPedido.CANCELADO
      ) {
        throw new BadRequestException(
          'No se puede modificar un pedido completado o cancelado',
        );
      }
      pedido.estado = dto.estado;
    }

    if (dto.notas !== undefined) {
      pedido.notas = dto.notas;
    }

    await this.pedidosRepository.save(pedido);

    return this.buscarPorId(id);
  }

  async eliminar(id: number): Promise<Pedido> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pedido = await this.buscarPorId(id);

      if (pedido.estado === EstadoPedido.COMPLETADO) {
        throw new BadRequestException(
          'No se puede cancelar un pedido completado',
        );
      }

      if (pedido.estado === EstadoPedido.CANCELADO) {
        throw new BadRequestException('El pedido ya está cancelado');
      }

      // Restaurar stock de todos los productos del pedido
      console.log('Restaurando stock de productos...');
      for (const detalle of pedido.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: detalle.producto.id },
        });

        if (producto) {
          producto.disponibilidad += detalle.cantidad;
          await queryRunner.manager.save(Producto, producto);
          console.log(
            `✓ Stock restaurado: ${producto.nombre} +${detalle.cantidad} (Total: ${producto.disponibilidad})`,
          );
        }
      }

      pedido.estado = EstadoPedido.CANCELADO;
      await queryRunner.manager.save(Pedido, pedido);

      await queryRunner.commitTransaction();

      return pedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerEstadisticas() {
    const total = await this.pedidosRepository.count();
    const enPreparacion = await this.pedidosRepository.contarPorEstado(
      EstadoPedido.PENDIENTE,
    );
    const completados = await this.pedidosRepository.contarPorEstado(
      EstadoPedido.COMPLETADO,
    );
    const cancelados = await this.pedidosRepository.contarPorEstado(
      EstadoPedido.CANCELADO,
    );
    const totalVentas = await this.pedidosRepository.obtenerTotalVentas();

    return {
      total,
      enPreparacion,
      completados,
      cancelados,
      totalVentas,
    };
  }

  async obtenerEstadisticasDelDia() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    // Total de pedidos del día - CAMBIADO A ACEPTADO
    const pedidosHoy = await this.pedidosRepository.count({
      where: {
        fechaCreacion: Between(hoy, manana),
        estado: EstadoPedido.ACEPTADO, // ✅ CAMBIO AQUÍ
      },
    });

    // Ganancia del día (solo pedidos aceptados) - CAMBIADO
    const result = await this.pedidosRepository
      .createQueryBuilder('pedido')
      .select('SUM(pedido.total)', 'total')
      .where('pedido.fechaCreacion >= :hoy', { hoy })
      .andWhere('pedido.fechaCreacion < :manana', { manana })
      .andWhere('pedido.estado = :estado', { estado: EstadoPedido.ACEPTADO }) // ✅ CAMBIO AQUÍ
      .getRawOne();

    const gananciaDelDia = Number(result?.total || 0);

    // Pedidos por método de pago - CAMBIADO
    const porMetodoPago = await this.pedidosRepository
      .createQueryBuilder('pedido')
      .select('pedido.metodoPago', 'metodo')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('SUM(pedido.total)', 'total')
      .where('pedido.fechaCreacion >= :hoy', { hoy })
      .andWhere('pedido.fechaCreacion < :manana', { manana })
      .andWhere('pedido.estado = :estado', { estado: EstadoPedido.ACEPTADO }) // ✅ CAMBIO AQUÍ
      .groupBy('pedido.metodoPago')
      .getRawMany();

    // Pedidos por tipo de entrega - CAMBIADO
    const porTipoEntrega = await this.pedidosRepository
      .createQueryBuilder('pedido')
      .select('pedido.tipoEntrega', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .where('pedido.fechaCreacion >= :hoy', { hoy })
      .andWhere('pedido.fechaCreacion < :manana', { manana })
      .andWhere('pedido.estado = :estado', { estado: EstadoPedido.ACEPTADO }) // ✅ CAMBIO AQUÍ
      .groupBy('pedido.tipoEntrega')
      .getRawMany();

    return {
      fecha: hoy,
      pedidosCompletados: pedidosHoy, // Nota: puedes renombrar esto a "pedidosAceptados" si quieres
      gananciaTotal: gananciaDelDia,
      porMetodoPago: porMetodoPago.map((mp) => ({
        metodo: mp.metodo,
        cantidad: Number(mp.cantidad),
        total: Number(mp.total),
      })),
      porTipoEntrega: porTipoEntrega.map((te) => ({
        tipo: te.tipo,
        cantidad: Number(te.cantidad),
      })),
    };
  }

  /**
   * Obtiene los productos más vendidos
   */
  async obtenerProductosMasVendidos(
    limite: number = 10,
    fechaInicio?: Date,
    fechaFin?: Date,
  ) {
    let query = this.detallesRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.pedido', 'pedido')
      .innerJoin('detalle.producto', 'producto')
      .select('producto.id', 'productoId')
      .addSelect('producto.nombre', 'nombre')
      .addSelect('producto.precio', 'precio')
      .addSelect('SUM(detalle.cantidad)', 'cantidadVendida')
      .addSelect('SUM(detalle.subtotal)', 'totalVentas')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ACEPTADO }); // ✅ CAMBIO

    if (fechaInicio && fechaFin) {
      query = query
        .andWhere('pedido.fechaCreacion >= :fechaInicio', { fechaInicio })
        .andWhere('pedido.fechaCreacion <= :fechaFin', { fechaFin });
    }

    const resultados = await query
      .groupBy('producto.id')
      .addGroupBy('producto.nombre')
      .addGroupBy('producto.precio')
      .orderBy('cantidadVendida', 'DESC')
      .limit(limite)
      .getRawMany();

    return resultados.map((r) => ({
      productoId: r.productoId,
      nombre: r.nombre,
      precio: Number(r.precio),
      cantidadVendida: Number(r.cantidadVendida),
      totalVentas: Number(r.totalVentas),
    }));
  }
  /**
   * Obtiene las ventas agrupadas por día para un rango de fechas
   */
  async obtenerVentasPorDia(fechaInicio: Date, fechaFin: Date) {
    const resultados = await this.pedidosRepository
      .createQueryBuilder('pedido')
      .select('DATE(pedido.fechaCreacion)', 'fecha')
      .addSelect('COUNT(*)', 'cantidadPedidos')
      .addSelect('SUM(pedido.total)', 'totalVentas')
      .where('pedido.fechaCreacion >= :fechaInicio', { fechaInicio })
      .andWhere('pedido.fechaCreacion <= :fechaFin', { fechaFin })
      .andWhere('pedido.estado = :estado', { estado: EstadoPedido.ACEPTADO }) // ✅ CAMBIO
      .groupBy('DATE(pedido.fechaCreacion)')
      .orderBy('fecha', 'ASC')
      .getRawMany();

    return resultados.map((r) => ({
      fecha: r.fecha,
      cantidadPedidos: Number(r.cantidadPedidos),
      totalVentas: Number(r.totalVentas),
    }));
  }

  /**
   * Obtiene estadísticas de un rango de fechas
   */
  async obtenerReporte(fechaInicio: Date, fechaFin: Date) {
    // Pedidos totales - CAMBIADO
    const totalPedidos = await this.pedidosRepository.count({
      where: {
        fechaCreacion: Between(fechaInicio, fechaFin),
        estado: EstadoPedido.ACEPTADO, // ✅ CAMBIO
      },
    });

    // Ventas totales - CAMBIADO
    const ventasTotales = await this.pedidosRepository
      .createQueryBuilder('pedido')
      .select('SUM(pedido.total)', 'total')
      .where('pedido.fechaCreacion >= :fechaInicio', { fechaInicio })
      .andWhere('pedido.fechaCreacion <= :fechaFin', { fechaFin })
      .andWhere('pedido.estado = :estado', { estado: EstadoPedido.ACEPTADO }) // ✅ CAMBIO
      .getRawOne();

    // Productos más vendidos
    const productosMasVendidos = await this.obtenerProductosMasVendidos(
      10,
      fechaInicio,
      fechaFin,
    );

    // Ventas por día
    const ventasPorDia = await this.obtenerVentasPorDia(fechaInicio, fechaFin);

    // Métodos de pago - CAMBIADO
    const metodoPago = await this.pedidosRepository
      .createQueryBuilder('pedido')
      .select('pedido.metodoPago', 'metodo')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('SUM(pedido.total)', 'total')
      .where('pedido.fechaCreacion >= :fechaInicio', { fechaInicio })
      .andWhere('pedido.fechaCreacion <= :fechaFin', { fechaFin })
      .andWhere('pedido.estado = :estado', { estado: EstadoPedido.ACEPTADO }) // ✅ CAMBIO
      .groupBy('pedido.metodoPago')
      .getRawMany();

    return {
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin,
      },
      resumen: {
        totalPedidos,
        ventasTotales: Number(ventasTotales?.total || 0),
        ticketPromedio:
          totalPedidos > 0
            ? Number(ventasTotales?.total || 0) / totalPedidos
            : 0,
      },
      productosMasVendidos,
      ventasPorDia,
      metodoPago: metodoPago.map((mp) => ({
        metodo: mp.metodo,
        cantidad: Number(mp.cantidad),
        total: Number(mp.total),
      })),
    };
  }

  private async generarNumeroPedido(): Promise<string> {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    const ultimoPedido = await this.pedidosRepository.obtenerUltimoPedido();
    const secuencia = ultimoPedido ? ultimoPedido.id + 1 : 1;

    return `PED-${año}${mes}${dia}-${String(secuencia).padStart(6, '0')}`;
  }
}
