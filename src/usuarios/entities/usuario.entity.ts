import { Entity, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { RolUsuario } from '../entities/rolUsuario.entity';
import { Auditoria } from '../../comun/entities/auditoria.entity';
import * as bcrypt from 'bcrypt';
import { Pedido } from 'src/pedidos/pedidosEntities/pedidos.entity';

@Entity()
export class Usuario extends Auditoria {
  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  apellidoPaterno!: string;

  @Column({ length: 100 })
  apellidoMaterno!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  ci!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono!: string | null;

  @Column({ length: 100, unique: true })
  correo!: string;

  @Column({ length: 255 })
  contrasena!: string;

  @Column({ default: false })
  verificado!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  verificacionToken!: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  verificacionExpirada!: Date | null;

  @OneToMany(() => RolUsuario, (usuarioRol) => usuarioRol.usuario)
  roles!: RolUsuario[];

  @OneToMany(() => Pedido, (pedido) => pedido.cliente)
  pedidos!: Pedido[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.contrasena) return;

    if (!this.contrasena.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.contrasena = await bcrypt.hash(this.contrasena, salt);
    }
  }
}
