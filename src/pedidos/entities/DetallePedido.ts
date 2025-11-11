import { Entity, ManyToOne, Column } from "typeorm";
import { Auditoria } from "../../auditoria/entities/datosAuditoria";
import { Pedido } from "./Pedido";
import { Producto } from "../../productos/entities/Producto";

@Entity()
export class DetallePedido extends Auditoria {
  @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { onDelete: "CASCADE" })
  pedido!: Pedido;

  @ManyToOne(() => Producto, (producto) => producto.detallePedidos, {
    onDelete: "RESTRICT",
  })
  producto!: Producto;

  @Column("int")
  cantidad!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  precioUnitario!: number;
}
