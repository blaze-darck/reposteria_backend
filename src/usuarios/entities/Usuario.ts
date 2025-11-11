import { Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Auditoria } from "../../auditoria/entities/datosAuditoria";
import { UsuarioRol } from "../entities/UsuarioRol";
import { Cliente } from "../entities/Cliente";

@Entity()
export class Usuario extends Auditoria {
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

  @OneToOne(() => Cliente, (perfil) => perfil.usuario)
  perfilCliente!: Cliente;
}
