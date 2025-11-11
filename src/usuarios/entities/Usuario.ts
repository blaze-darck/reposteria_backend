import { Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { BaseEntityAudit } from "../../auditoria/entities/datosAuditoria";
import { UsuarioRol } from "../entities/UsuarioRol";
import { PerfilCliente } from "../entities/Cliente";

@Entity()
export class Usuario extends BaseEntityAudit {
  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  apellido_paterno!: string;

  @Column({ length: 100 })
  apellido_materno!: string;

  @Column({ length: 100, unique: true })
  correo!: string;

  @Column()
  contraseña!: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  roles!: UsuarioRol[];

  @OneToOne(() => PerfilCliente, (perfil) => perfil.usuario)
  perfilCliente!: PerfilCliente;
}
