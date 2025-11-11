import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntityAudit } from "../../auditoria/entities/datosAuditoria";
import { ProductoIngrediente } from "./ProductoIngrediente";
import { InventarioIngrediente } from "../../inventario/entities/InventarioIngredientes";

@Entity()
export class Ingrediente extends BaseEntityAudit {
  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 20, nullable: true })
  unidad?: string;

  @OneToMany(() => ProductoIngrediente, (pi) => pi.ingrediente)
  productos!: ProductoIngrediente[];

  @OneToMany(() => InventarioIngrediente, (inv) => inv.ingrediente)
  inventario!: InventarioIngrediente[];
}
