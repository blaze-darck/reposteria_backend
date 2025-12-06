import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetallePedido } from './detallePedido.entity';
import { Auditoria } from '../../comun/entities/auditoria.entity'; // Ajusta la ruta según tu proyecto

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  ACEPTADO = 'ACEPTADO',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO = 'LISTO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

export enum MetodoPago {
  QR = 'QR',
  EFECTIVO = 'EFECTIVO',
}

export enum TipoEntrega {
  LLEVAR = 'LLEVAR',
  PARA_AQUI = 'PARA_AQUI',
}

@Entity('pedidos')
export class Pedido extends Auditoria {
  @Column({ unique: true, name: 'numero_pedido' })
  numeroPedido: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  cliente: Usuario;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.PENDIENTE,
  })
  estado: EstadoPedido;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: TipoEntrega,
    name: 'tipo_entrega',
  })
  tipoEntrega: TipoEntrega;

  @Column({
    type: 'enum',
    enum: MetodoPago,
    name: 'metodo_pago',
  })
  metodoPago: MetodoPago;

  @Column({ type: 'text', nullable: true })
  notas: string | null;

  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, {
    cascade: true,
    eager: true,
  })
  detalles: DetallePedido[];
}
