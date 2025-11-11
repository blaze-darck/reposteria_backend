import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntityAudit } from "../../auditoria/entities/datosAuditoria";
import { Categoria } from "../entities/Categoria";
import { ProductoIngrediente } from "./ProductoIngrediente";
import { DetallePedido } from "../../pedidos/entities/DetallePedido";

@Entity()
export class Producto extends BaseEntityAudit {
  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: "text", nullable: true })
  descripcion?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  precio!: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    onDelete: "RESTRICT",
  })
  categoria!: Categoria;

  @OneToMany(() => ProductoIngrediente, (pi) => pi.producto)
  ingredientes!: ProductoIngrediente[];

  @OneToMany(() => DetallePedido, (detalle) => detalle.producto)
  detallePedidos!: DetallePedido[];
}
