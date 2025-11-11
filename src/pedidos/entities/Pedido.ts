import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Auditoria } from "../../auditoria/entities/datosAuditoria";
import { Usuario } from "../../usuarios/entities/Usuario";
import { DetallePedido } from "../entities/DetallePedido";
import { Pago } from "../../pagos/entities/Pago";

@Entity()
export class Pedido extends Auditoria {
  @ManyToOne(() => Usuario, (usuario) => usuario.perfilCliente, {
    onDelete: "RESTRICT",
  })
  usuario!: Usuario;

  @Column({
    type: "enum",
    enum: ["pendiente", "en_proceso", "completado", "cancelado"],
    default: "pendiente",
  })
  estado!: "pendiente" | "en_proceso" | "completado" | "cancelado";

  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
  detalles!: DetallePedido[];

  @OneToMany(() => Pago, (pago) => pago.pedido)
  pagos!: Pago[];
}
