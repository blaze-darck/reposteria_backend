import { Entity, ManyToOne, Column, Unique } from "typeorm";
import { BaseEntityAudit } from "../../auditoria/entities/datosAuditoria";
import { Producto } from "../entities/Producto";
import { Ingrediente } from "../entities/Ingrediente";

@Entity()
@Unique(["producto", "ingrediente"])
export class ProductoIngrediente extends BaseEntityAudit {
  @ManyToOne(() => Producto, (producto) => producto.ingredientes, {
    onDelete: "CASCADE",
  })
  producto!: Producto;

  @ManyToOne(() => Ingrediente, (ingrediente) => ingrediente.productos, {
    onDelete: "CASCADE",
  })
  ingrediente!: Ingrediente;

  @Column("decimal", { precision: 10, scale: 2 })
  cantidad!: number;
}
