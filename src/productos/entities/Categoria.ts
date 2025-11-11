import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntityAudit } from "../../auditoria/entities/datosAuditoria";
import { Producto } from "../../productos/entities/Producto";

@Entity()
export class Categoria extends BaseEntityAudit {
  @Column({ length: 50 })
  nombre!: string;

  @Column({ type: "text", nullable: true })
  descripcion?: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos!: Producto[];
}
