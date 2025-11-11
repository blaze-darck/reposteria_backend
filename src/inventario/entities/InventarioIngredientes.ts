import { Entity, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { BaseEntityAudit } from "../../auditoria/entities/datosAuditoria";
import { Ingrediente } from "../../productos/entities/Ingrediente";

@Entity()
export class InventarioIngrediente extends BaseEntityAudit {
  @ManyToOne(() => Ingrediente, (ingrediente) => ingrediente.inventario, {
    onDelete: "CASCADE",
  })
  ingrediente!: Ingrediente;

  @Column("decimal", { precision: 10, scale: 2 })
  cantidad!: number;

  @CreateDateColumn()
  fechaActualizacion!: Date;
}
