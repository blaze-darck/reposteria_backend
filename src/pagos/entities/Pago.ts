import { Entity, ManyToOne, Column } from "typeorm";
import { Auditoria } from "../../auditoria/entities/datosAuditoria";
import { Pedido } from "../../pedidos/entities/Pedido";

@Entity()
export class Pago extends Auditoria {
  @ManyToOne(() => Pedido, (pedido) => pedido.pagos, { onDelete: "CASCADE" })
  pedido!: Pedido;

  @Column({ type: "datetime", nullable: true })
  fechaPago?: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  monto!: number;

  @Column({
    type: "enum",
    enum: ["efectivo", "tarjeta", "transferencia"],
    nullable: true,
  })
  metodoPago?: "efectivo" | "tarjeta" | "transferencia";

  @Column({ default: false })
  confirmado!: boolean;
}
