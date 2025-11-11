import { Entity, ManyToOne, Unique } from "typeorm";
import { BaseEntityAudit } from "../../auditoria/entities/datosAuditoria";
import { Usuario } from "./Usuario";
import { Rol } from "./Rol";

@Entity()
@Unique(["usuario", "rol"])
export class UsuarioRol extends BaseEntityAudit {
  @ManyToOne(() => Usuario, (usuario) => usuario.roles, { onDelete: "CASCADE" })
  usuario!: Usuario;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { onDelete: "CASCADE" })
  rol!: Rol;
}
