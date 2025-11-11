import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntityAudit } from "../../auditoria/entities/datosAuditoria";
import { UsuarioRol } from "../entities/UsuarioRol";

@Entity()
export class Rol extends BaseEntityAudit {
  @Column({ length: 50, unique: true })
  nombre!: string;

  @Column({ type: "text", nullable: true })
  descripcion?: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  usuarios!: UsuarioRol[];
}
