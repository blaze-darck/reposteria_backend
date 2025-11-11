import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { Auditoria } from "../../auditoria/entities/datosAuditoria";
import { Usuario } from "../entities/Usuario";

@Entity()
export class Cliente extends Auditoria {
  @Column({ length: 20, nullable: true })
  telefono?: string;

  @Column({ type: "text", nullable: true })
  direccion?: string;

  @OneToOne(() => Usuario, (usuario) => usuario.perfilCliente, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuario!: Usuario;
}
